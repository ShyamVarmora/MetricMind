from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from time import monotonic

from fastapi import APIRouter, HTTPException, Query

from app.database import get_connection

router = APIRouter(prefix="/analytics", tags=["Analytics"])
ALLOWED_CATEGORIES = {"All Categories", "Sales", "Revenue", "Customers", "Products"}
_CACHE = {}
_CACHE_TTL_SECONDS = 30


def _date_filter(start_date, end_date, alias="d"):
    clauses, params = [], []
    if start_date:
        clauses.append(f"{alias}.FullDateAlternateKey >= %s")
        params.append(start_date)
    if end_date:
        clauses.append(f"{alias}.FullDateAlternateKey <= %s")
        params.append(end_date)
    return (" AND " + " AND ".join(clauses)) if clauses else "", params


def _run(sql, params):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        return cursor.fetchall()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def _summary(date_sql, params):
    rows = _run(f"""
        SELECT ROUND(COALESCE(SUM(f.SalesAmount),0),2) AS total_sales,
               COUNT(DISTINCT f.SalesOrderNumber) AS total_orders,
               COUNT(DISTINCT f.CustomerKey) AS total_customers,
               COUNT(DISTINCT f.ProductKey) AS total_products
        FROM factinternetsales f
        JOIN dimdate d ON f.OrderDateKey=d.DateKey
        WHERE 1=1 {date_sql}
    """, params)
    return rows[0] if rows else {}


def _series(category, date_sql, params):
    value_sql = "COUNT(DISTINCT f.CustomerKey)" if category == "Customers" else "COUNT(DISTINCT f.ProductKey)" if category == "Products" else "SUM(f.SalesAmount)"
    label = "customers" if category == "Customers" else "products" if category == "Products" else "sales"
    return label, _run(f"""
        SELECT CONCAT(d.CalendarYear,'-',LPAD(d.MonthNumberOfYear,2,'0')) AS month,
               ROUND(COALESCE({value_sql},0),2) AS value
        FROM factinternetsales f
        JOIN dimdate d ON f.OrderDateKey=d.DateKey
        WHERE 1=1 {date_sql}
        GROUP BY d.CalendarYear,d.MonthNumberOfYear
        ORDER BY d.CalendarYear,d.MonthNumberOfYear
        LIMIT 240
    """, params)


def _products(date_sql, params):
    return _run(f"""
        SELECT p.EnglishProductName AS product,
               ROUND(COALESCE(SUM(f.SalesAmount),0),2) AS sales
        FROM factinternetsales f
        JOIN dimdate d ON f.OrderDateKey=d.DateKey
        JOIN dimproduct p ON f.ProductKey=p.ProductKey
        WHERE 1=1 {date_sql}
        GROUP BY p.EnglishProductName
        ORDER BY sales DESC
        LIMIT 10
    """, params)


def _breakdown(category, date_sql, params):
    if category == "Customers":
        sql = f"""
            SELECT g.EnglishCountryRegionName AS label, COUNT(DISTINCT f.CustomerKey) AS value
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey
            JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
            WHERE 1=1 {date_sql}
            GROUP BY g.EnglishCountryRegionName ORDER BY value DESC LIMIT 10
        """
        title = "Customers by Country"
    elif category == "Products":
        sql = f"""
            SELECT p.EnglishProductName AS label, ROUND(SUM(f.SalesAmount),2) AS value
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimproduct p ON f.ProductKey=p.ProductKey
            WHERE 1=1 {date_sql}
            GROUP BY p.EnglishProductName ORDER BY value DESC LIMIT 10
        """
        title = "Products by Sales"
    else:
        sql = f"""
            SELECT g.EnglishCountryRegionName AS label, ROUND(SUM(f.SalesAmount),2) AS value
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey
            JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
            WHERE 1=1 {date_sql}
            GROUP BY g.EnglishCountryRegionName ORDER BY value DESC LIMIT 10
        """
        title = "Sales by Country"
    return title, _run(sql, params)


def _validate_dates(start_date, end_date):
    try:
        if start_date:
            datetime.strptime(start_date, "%Y-%m-%d")
        if end_date:
            datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Dates must use YYYY-MM-DD format")
    if start_date and end_date and start_date > end_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date")


def _load_analytics(category, start_date, end_date):
    date_sql, params = _date_filter(start_date, end_date)
    # These reads are independent, so run them concurrently rather than waiting
    # for four full-table aggregations one after another.
    with ThreadPoolExecutor(max_workers=4) as pool:
        f_summary = pool.submit(_summary, date_sql, params)
        f_series = pool.submit(_series, category, date_sql, params)
        f_products = pool.submit(_products, date_sql, params)
        f_breakdown = pool.submit(_breakdown, category, date_sql, params)
        summary = f_summary.result()
        label, raw_series = f_series.result()
        products = f_products.result()
        breakdown_title, raw_breakdown = f_breakdown.result()

    return {
        "category": category,
        "total_sales": float(summary.get("total_sales", 0) or 0),
        "total_orders": int(summary.get("total_orders", 0) or 0),
        "total_customers": int(summary.get("total_customers", 0) or 0),
        "total_products": int(summary.get("total_products", 0) or 0),
        "series": [{"month": row["month"], label: float(row["value"] or 0)} for row in raw_series],
        "products": products,
        "breakdown_title": breakdown_title,
        "breakdown": [{"label": row["label"], "value": float(row["value"] or 0)} for row in raw_breakdown],
        "filters": {"start_date": start_date, "end_date": end_date, "category": category},
    }


def _get_cached(category, start_date, end_date):
    key = (category, start_date, end_date)
    now = monotonic()
    cached = _CACHE.get(key)
    if cached and now - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]
    data = _load_analytics(category, start_date, end_date)
    _CACHE[key] = (now, data)
    # Keep the tiny in-process cache bounded.
    if len(_CACHE) > 20:
        oldest = min(_CACHE, key=lambda item: _CACHE[item][0])
        _CACHE.pop(oldest, None)
    return data


@router.get("")
def analytics(
    category: str = Query("All Categories"),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
):
    # Swagger/browser clients can send an empty category value. Treat it as the
    # same default used by the dashboard instead of returning a needless 400.
    category = (category or "All Categories").strip() or "All Categories"
    return analytics_overview(category=category, start_date=start_date, end_date=end_date)


@router.get("/overview")
def analytics_overview(
    category: str = Query("All Categories"),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
):
    category = (category or "All Categories").strip() or "All Categories"
    if category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=400, detail="Unsupported analytics category")
    _validate_dates(start_date, end_date)
    try:
        data = _get_cached(category, start_date, end_date)
        return {
            "success": True,
            "message": "Analytics fetched successfully",
            "data": data,
            "meta": {"endpoint": "/analytics/overview", "timestamp": datetime.now().isoformat()},
        }
    except HTTPException:
        raise
    except Exception as exc:
        print("Analytics error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load analytics data")


@router.get("/sales")
def analytics_sales():
    rows = _run("""
        SELECT p.EnglishProductName, ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f JOIN dimproduct p ON f.ProductKey=p.ProductKey
        GROUP BY p.EnglishProductName ORDER BY sales DESC LIMIT 10
    """, [])
    return {"success": True, "message": "Sales analytics fetched successfully", "data": rows}


@router.get("/products")
def analytics_products():
    rows = _run("SELECT COUNT(DISTINCT ProductKey) AS total_products FROM factinternetsales", [])
    return {"success": True, "message": "Products analytics fetched successfully", "data": rows[0] if rows else {}}


@router.get("/customers")
def analytics_customers():
    rows = _run("SELECT COUNT(DISTINCT CustomerKey) AS total_customers FROM factinternetsales", [])
    return {"success": True, "message": "Customer analytics fetched successfully", "data": rows[0] if rows else {}}


@router.get("/monthly")
def analytics_monthly():
    rows = _run("""
        SELECT CONCAT(d.CalendarYear,'-',LPAD(d.MonthNumberOfYear,2,'0')) AS month,
               ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
        GROUP BY d.CalendarYear,d.MonthNumberOfYear
        ORDER BY d.CalendarYear,d.MonthNumberOfYear LIMIT 240
    """, [])
    return {"success": True, "message": "Monthly analytics fetched successfully", "data": rows}
