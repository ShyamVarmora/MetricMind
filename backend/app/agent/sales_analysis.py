from __future__ import annotations

from typing import Any

from app.database import get_connection

EUROPE = ("France", "Germany", "United Kingdom")


def _run(sql: str, params: list[Any]) -> list[dict]:
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


def _scope(question: str) -> tuple[str, list[Any], str]:
    q = question.lower()
    if "europ" in q:
        return "g.EnglishCountryRegionName IN (%s,%s,%s)", list(EUROPE), "Europe"
    return "1=1", [], "all regions"


def analyze_sales_increase(question: str) -> dict:
    scope_sql, scope_params, scope_label = _scope(question)
    q = question.lower()
    if "q3" in q or "quarter 3" in q:
        comparison = _run(f"""
            SELECT d.CalendarYear AS year, d.CalendarQuarter AS quarter,
                   ROUND(SUM(f.SalesAmount),2) AS sales
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey
            JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
            WHERE {scope_sql}
              AND ((d.CalendarYear,d.CalendarQuarter)=(
                    SELECT MAX(d2.CalendarYear), 3 FROM dimdate d2
                    JOIN factinternetsales f2 ON f2.OrderDateKey=d2.DateKey
                    WHERE d2.CalendarQuarter=3
              ) OR (d.CalendarYear,d.CalendarQuarter)=(
                    SELECT MAX(d3.CalendarYear), 2 FROM dimdate d3
                    JOIN factinternetsales f3 ON f3.OrderDateKey=d3.DateKey
                    WHERE d3.CalendarQuarter=3 AND d3.CalendarYear=(
                        SELECT MAX(d4.CalendarYear) FROM dimdate d4
                        JOIN factinternetsales f4 ON f4.OrderDateKey=d4.DateKey
                        WHERE d4.CalendarQuarter=3
                    )
              ))
            GROUP BY d.CalendarYear,d.CalendarQuarter
            ORDER BY d.CalendarYear DESC,d.CalendarQuarter DESC
        """, scope_params)
        latest_q = comparison[0] if comparison else None
        previous_q = comparison[1] if len(comparison) > 1 else None
        period = "Q3"
        detail_filter = "d.CalendarQuarter=3 AND d.CalendarYear=%s"
        if latest_q:
            detail_params = [latest_q["year"], *scope_params]
            country_latest = _run(f"""
                SELECT g.EnglishCountryRegionName AS label, ROUND(SUM(f.SalesAmount),2) AS sales
                FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
                JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
                WHERE {detail_filter} AND {scope_sql}
                GROUP BY g.EnglishCountryRegionName ORDER BY sales DESC LIMIT 10
            """, detail_params)
            product_latest = _run(f"""
                SELECT p.EnglishProductName AS label, ROUND(SUM(f.SalesAmount),2) AS sales
                FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
                JOIN dimproduct p ON f.ProductKey=p.ProductKey
                JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
                WHERE {detail_filter} AND {scope_sql}
                GROUP BY p.EnglishProductName ORDER BY sales DESC LIMIT 10
            """, detail_params)
        else:
            country_latest, product_latest = [], []
        return {
            "scope": scope_label, "period": period, "comparison": comparison,
            "countries": country_latest, "products": product_latest,
            "steps": 3,
            "sql_note": "The Q3 result is compared with Q2 and then broken down by country and product."
        }

    latest = _run(f"""
        SELECT d.CalendarYear AS year,d.MonthNumberOfYear AS month,
               ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
        JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
        WHERE {scope_sql}
        GROUP BY d.CalendarYear,d.MonthNumberOfYear
        ORDER BY d.CalendarYear DESC,d.MonthNumberOfYear DESC LIMIT 2
    """, scope_params)
    latest_month = latest[0] if latest else None
    previous_month = latest[1] if len(latest) > 1 else None
    countries = products = []
    if latest_month:
        date_clause = "d.CalendarYear=%s AND d.MonthNumberOfYear=%s"
        p = [latest_month["year"], latest_month["month"], *scope_params]
        countries = _run(f"""
            SELECT g.EnglishCountryRegionName AS label, ROUND(SUM(f.SalesAmount),2) AS sales
            FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
            WHERE {date_clause} AND {scope_sql}
            GROUP BY g.EnglishCountryRegionName ORDER BY sales DESC LIMIT 10
        """, p)
        products = _run(f"""
            SELECT p.EnglishProductName AS label, ROUND(SUM(f.SalesAmount),2) AS sales
            FROM factinternetsales f JOIN dimdate d ON f.OrderDateKey=d.DateKey
            JOIN dimproduct p ON f.ProductKey=p.ProductKey
            JOIN dimcustomer c ON f.CustomerKey=c.CustomerKey JOIN dimgeography g ON c.GeographyKey=g.GeographyKey
            WHERE {date_clause} AND {scope_sql}
            GROUP BY p.EnglishProductName ORDER BY sales DESC LIMIT 10
        """, p)
    return {"scope": scope_label, "period": "latest month", "comparison": latest, "countries": countries, "products": products, "steps": 3}


def format_sales_analysis(analysis: dict) -> str:
    rows = analysis.get("comparison", [])
    if len(rows) < 2:
        return "There are not two comparable periods in the database, so I cannot establish why sales increased."
    latest, previous = rows[0], rows[1]
    delta = float(latest["sales"] or 0) - float(previous["sales"] or 0)
    pct = (delta / float(previous["sales"])) * 100 if float(previous["sales"] or 0) else 0
    period = analysis["period"]
    if delta <= 0:
        return f"Sales did not increase in the latest {period}. They changed from ₹{previous['sales']:,.2f} to ₹{latest['sales']:,.2f}, a change of {pct:+.2f}%."
    parts = [f"{analysis['scope'].title()} sales increased by ₹{delta:,.2f} ({pct:+.2f}%) from the comparison period to {period}."]
    countries = analysis.get("countries", [])
    products = analysis.get("products", [])
    if countries:
        parts.append(f"The largest {analysis['scope']} country by sales in {period} was {countries[0]['label']} at ₹{countries[0]['sales']:,.2f}.")
    if products:
        parts.append(f"The leading product was {products[0]['label']} at ₹{products[0]['sales']:,.2f}.")
    parts.append("These are measured contributors, not a causal claim beyond the fields available in the database.")
    return " ".join(parts)
