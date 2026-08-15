from app.database import get_connection


def execute_metric_query(metric: str):
    """
    Execute a governed metric query against the existing MySQL database.

    The agent provides only a validated metric name.
    The agent never provides or executes raw SQL.
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        # --------------------------------
        # Total Revenue
        # --------------------------------
        if metric == "totalRevenue":

            cursor.execute("""
                SELECT
                    ROUND(SUM(SalesAmount), 2) AS total_revenue
                FROM factinternetsales;
            """)

        # --------------------------------
        # Total Cost
        # --------------------------------
        elif metric == "totalCost":

            cursor.execute("""
                SELECT
                    ROUND(
                        SUM(TotalProductCost) + SUM(Freight),
                        2
                    ) AS total_cost
                FROM factinternetsales;
            """)

        # --------------------------------
        # Shipping Cost
        # --------------------------------
        elif metric == "shippingCost":

            cursor.execute("""
                SELECT
                    ROUND(SUM(Freight), 2) AS shipping_cost
                FROM factinternetsales;
            """)

        # --------------------------------
        # Material Cost
        # --------------------------------
        elif metric == "materialCost":

            # The current database does not contain
            # a separate material-cost column.
            return [{
                "material_cost": None,
                "available": False,
                "message": "Required data unavailable."
            }]

        # --------------------------------
        # Other Cost
        # --------------------------------
        elif metric == "otherCost":

            # The current database does not contain
            # a separate other-cost column.
            return [{
                "other_cost": None,
                "available": False,
                "message": "Required data unavailable."
            }]

        # --------------------------------
        # Margin Percent
        # --------------------------------
        elif metric == "marginPercent":

            cursor.execute("""
                SELECT
                    ROUND(
                        (
                            SUM(SalesAmount)
                            -
                            (
                                SUM(TotalProductCost)
                                +
                                SUM(Freight)
                            )
                        )
                        /
                        NULLIF(
                            SUM(SalesAmount),
                            0
                        )
                        * 100,
                        2
                    ) AS margin_percent
                FROM factinternetsales;
            """)

        # --------------------------------
        # Transaction Count
        # --------------------------------
        elif metric == "transactionCount":

            cursor.execute("""
                SELECT
                    COUNT(DISTINCT SalesOrderNumber)
                    AS transaction_count
                FROM factinternetsales;
            """)

        # --------------------------------
        # Customers
        # --------------------------------
        elif metric == "customers":

            cursor.execute("""
                SELECT
                    COUNT(DISTINCT CustomerKey)
                    AS total_customers
                FROM factinternetsales;
            """)

        # --------------------------------
        # Products
        # --------------------------------
        elif metric == "products":

            cursor.execute("""
                SELECT
                    COUNT(DISTINCT ProductKey)
                    AS total_products
                FROM factinternetsales;
            """)

        # --------------------------------
        # Unsupported Metric
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


# --------------------------------
# European Margin Analysis
# --------------------------------

def execute_europe_margin_analysis():
    """
    Analyze European margin across the latest two
    available quarters.

    Europe is represented by:
    France, Germany and United Kingdom.

    The calculation uses only fields that actually
    exist in the current MySQL database.

    Margin formula:

    (Revenue - Total Cost) / Revenue * 100

    Current available cost fields:

    TotalProductCost
    Freight

    Separate materialCost and otherCost fields
    are not available.
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
                    SUM(f.TotalProductCost)
                    +
                    SUM(f.Freight),
                    2
                ) AS total_cost,

                ROUND(
                    SUM(f.TotalProductCost),
                    2
                ) AS product_cost,

                ROUND(
                    SUM(f.Freight),
                    2
                ) AS shipping_cost,

                ROUND(
                    SUM(f.SalesAmount)
                    -
                    (
                        SUM(f.TotalProductCost)
                        +
                        SUM(f.Freight)
                    ),
                    2
                ) AS profit,

                ROUND(
                    (
                        SUM(f.SalesAmount)
                        -
                        (
                            SUM(f.TotalProductCost)
                            +
                            SUM(f.Freight)
                        )
                    )
                    /
                    NULLIF(
                        SUM(f.SalesAmount),
                        0
                    )
                    * 100,
                    2
                ) AS margin_percent

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
            -
            previous["margin_percent"],
            2
        )

        return {

            "latest_quarter": latest,

            "previous_quarter": previous,

            "margin_change_percentage_points":
                margin_change,

            "cost_breakdown_available": {

                "total_cost": True,

                "product_cost": True,

                "shipping_cost": True,

                "material_cost": False,

                "other_cost": False
            }
        }

    finally:

        cursor.close()
        conn.close()