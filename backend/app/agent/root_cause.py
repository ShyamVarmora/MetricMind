from app.database import get_connection

EUROPE = ("France", "Germany", "United Kingdom")


def analyze_europe_margin() -> dict:
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        margin_sql = """
            SELECT d.CalendarYear AS year,
                   d.CalendarQuarter AS quarter,
                   ROUND(SUM(f.SalesAmount), 2) AS revenue,
                   ROUND(((SUM(f.SalesAmount) - SUM(f.TotalProductCost) - SUM(f.Freight))
                          / NULLIF(SUM(f.SalesAmount), 0)) * 100, 2) AS margin_percent
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey = d.DateKey
            JOIN dimcustomer c ON f.CustomerKey = c.CustomerKey
            JOIN dimgeography g ON c.GeographyKey = g.GeographyKey
            WHERE g.EnglishCountryRegionName IN (%s, %s, %s)
            GROUP BY d.CalendarYear, d.CalendarQuarter
            ORDER BY d.CalendarYear DESC, d.CalendarQuarter DESC
            LIMIT 2
        """
        cursor.execute(margin_sql, list(EUROPE))
        quarters = cursor.fetchall()
        if len(quarters) < 2:
            return {"quarters": quarters, "cost_breakdown": [], "sql": [margin_sql], "params": [list(EUROPE)]}

        latest, previous = quarters
        cost_sql = """
            SELECT d.CalendarYear AS year,
                   d.CalendarQuarter AS quarter,
                   ROUND(SUM(f.TotalProductCost), 2) AS material_cost,
                   ROUND(SUM(f.Freight), 2) AS shipping_cost
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey = d.DateKey
            JOIN dimcustomer c ON f.CustomerKey = c.CustomerKey
            JOIN dimgeography g ON c.GeographyKey = g.GeographyKey
            WHERE g.EnglishCountryRegionName IN (%s, %s, %s)
              AND (d.CalendarYear, d.CalendarQuarter) IN ((%s, %s), (%s, %s))
            GROUP BY d.CalendarYear, d.CalendarQuarter
            ORDER BY d.CalendarYear DESC, d.CalendarQuarter DESC
        """
        params = [*EUROPE, latest["year"], latest["quarter"], previous["year"], previous["quarter"]]
        cursor.execute(cost_sql, params)
        costs = cursor.fetchall()
        by_period = {(row["year"], row["quarter"]): row for row in costs}
        latest_cost = by_period.get((latest["year"], latest["quarter"]), {})
        previous_cost = by_period.get((previous["year"], previous["quarter"]), {})

        return {
            "quarters": quarters,
            "cost_breakdown": costs,
            "latest": latest,
            "previous": previous,
            "shipping_change": round(float(latest_cost.get("shipping_cost") or 0) - float(previous_cost.get("shipping_cost") or 0), 2),
            "material_change": round(float(latest_cost.get("material_cost") or 0) - float(previous_cost.get("material_cost") or 0), 2),
            "revenue_change": round(float(latest["revenue"] or 0) - float(previous["revenue"] or 0), 2),
            "margin_change": round(float(latest["margin_percent"] or 0) - float(previous["margin_percent"] or 0), 2),
            "sql": [margin_sql, cost_sql],
            "params": [list(EUROPE), params],
        }
    finally:
        cursor.close()
        conn.close()
