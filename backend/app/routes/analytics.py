from fastapi import APIRouter
from app.database import get_connection
from datetime import datetime

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("")
def analytics():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount),2) AS total_sales,
            COUNT(DISTINCT SalesOrderNumber) AS total_orders,
            COUNT(DISTINCT CustomerKey) AS total_customers
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Analytics fetched successfully",
        "data": data,
        "meta": {
            "endpoint": "/analytics",
            "timestamp": datetime.now().isoformat()
        }
    }


@router.get("/sales")
def analytics_sales():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            EnglishProductName,
            ROUND(SUM(SalesAmount),2) AS sales
        FROM factinternetsales f
        JOIN dimproduct p
            ON f.ProductKey = p.ProductKey
        GROUP BY EnglishProductName
        ORDER BY sales DESC
        LIMIT 10;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Sales analytics fetched successfully",
        "data": data,
        "meta": {
            "endpoint": "/analytics/sales",
            "timestamp": datetime.now().isoformat()
        }
    }


@router.get("/products")
def analytics_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(DISTINCT ProductKey) AS total_products
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Products analytics fetched successfully",
        "data": data,
        "meta": {
            "endpoint": "/analytics/products",
            "timestamp": datetime.now().isoformat()
        }
    }


@router.get("/customers")
def analytics_customers():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(DISTINCT CustomerKey) AS total_customers
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Customer analytics fetched successfully",
        "data": data,
        "meta": {
            "endpoint": "/analytics/customers",
            "timestamp": datetime.now().isoformat()
        }
    }


@router.get("/monthly")
def analytics_monthly():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            d.EnglishMonthName AS month,
            ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f
        JOIN dimdate d
            ON f.OrderDateKey = d.DateKey
        GROUP BY
            d.MonthNumberOfYear,
            d.EnglishMonthName
        ORDER BY
            d.MonthNumberOfYear;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Monthly analytics fetched successfully",
        "data": data,
        "meta": {
            "endpoint": "/analytics/monthly",
            "timestamp": datetime.now().isoformat()
        }
    }