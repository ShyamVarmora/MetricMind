from app.database import get_connection


def execute_metric_query(metric: str):
    """
    Execute a trusted metric query against the existing MySQL database.

    The agent supplies only a validated metric name.
    It never supplies raw SQL.
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        # --------------------------------
        # Total Sales / Revenue
        # --------------------------------
        if metric == "totalSales":
            cursor.execute("""
                SELECT
                    ROUND(SUM(SalesAmount), 2) AS total_sales
                FROM factinternetsales;
            """)

        # --------------------------------
        # Orders
        # --------------------------------
        elif metric == "orders":
            cursor.execute("""
                SELECT
                    COUNT(DISTINCT SalesOrderNumber) AS total_orders
                FROM factinternetsales;
            """)

        # --------------------------------
        # Customers
        # --------------------------------
        elif metric == "customers":
            cursor.execute("""
                SELECT
                    COUNT(DISTINCT CustomerKey) AS total_customers
                FROM factinternetsales;
            """)

        # --------------------------------
        # Products
        # --------------------------------
        elif metric == "products":
            cursor.execute("""
                SELECT
                    COUNT(DISTINCT ProductKey) AS total_products
                FROM factinternetsales;
            """)

        # --------------------------------
        # Profit
        # --------------------------------
        elif metric == "profit":
            cursor.execute("""
                SELECT
                    ROUND(
                        SUM(SalesAmount - TotalProductCost),
                        2
                    ) AS profit
                FROM factinternetsales;
            """)

        # --------------------------------
        # Monthly Sales
        # --------------------------------
        elif metric == "monthlySales":
            cursor.execute("""
                SELECT
                    d.EnglishMonthName AS month,
                    ROUND(SUM(f.SalesAmount), 2) AS sales
                FROM factinternetsales f
                JOIN dimdate d
                    ON f.OrderDateKey = d.DateKey
                GROUP BY
                    d.MonthNumberOfYear,
                    d.EnglishMonthName
                ORDER BY
                    d.MonthNumberOfYear;
            """)

        # --------------------------------
        # Unsupported metric
        # --------------------------------
        else:
            raise ValueError(
                f"Metric '{metric}' is not currently "
                "supported by the backend data layer."
            )

        result = cursor.fetchall()

        return result

    finally:
        cursor.close()
        conn.close()

def execute_europe_margin_analysis():
    """
    Analyze European margin across the latest two
    available quarters.

    Europe is represented by France, Germany,
    and United Kingdom in the current dataset.

    Only fields that actually exist in the database
    are used.
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                d.CalendarYear,
                d.CalendarQuarter,

                ROUND(
                    SUM(f.SalesAmount),
                    2
                ) AS revenue,

                ROUND(
                    SUM(f.TotalProductCost),
                    2
                ) AS product_cost,

                ROUND(
                    SUM(
                        f.SalesAmount - f.TotalProductCost
                    ),
                    2
                ) AS profit,

                ROUND(
                    SUM(
                        f.SalesAmount - f.TotalProductCost
                    )
                    / NULLIF(
                        SUM(f.SalesAmount),
                        0
                    ) * 100,
                    2
                ) AS margin_percent,

                ROUND(
                    SUM(f.Freight),
                    2
                ) AS freight

            FROM factinternetsales f

            JOIN dimdate d
                ON f.OrderDateKey = d.DateKey

            JOIN dimgeography g
                ON f.SalesTerritoryKey = g.SalesTerritoryKey

            WHERE
                g.EnglishCountryRegionName IN (
                    'France',
                    'Germany',
                    'United Kingdom'
                )

            GROUP BY
                d.CalendarYear,
                d.CalendarQuarter

            HAVING
                COUNT(*) > 0

            ORDER BY
                d.CalendarYear DESC,
                d.CalendarQuarter DESC

            LIMIT 2;
        """)

        quarters = cursor.fetchall()

        if len(quarters) < 2:
            raise ValueError(
                "Insufficient European quarterly data "
                "for margin comparison."
            )

        latest = quarters[0]
        previous = quarters[1]

        margin_change = round(
            latest["margin_percent"]
            - previous["margin_percent"],
            2
        )

        return {
            "latest_quarter": latest,
            "previous_quarter": previous,
            "margin_change_percentage_points": margin_change,
            "cost_breakdown_available": {
                "product_cost": True,
                "freight": True,
                "material_cost": False,
                "other_cost": False
            }
        }

    finally:
        cursor.close()
        conn.close()