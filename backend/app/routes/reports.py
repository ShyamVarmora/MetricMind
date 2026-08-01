from fastapi import APIRouter
from app.database import get_connection

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/sales")
def sales_report():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            d.EnglishMonthName AS month,
            ROUND(SUM(f.SalesAmount),2) AS revenue
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
        "data": data
    }


@router.get("/revenue")
def revenue_report():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT ROUND(SUM(SalesAmount),2) AS total_revenue
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "data": data
    }


@router.get("/customer")
def customer_report():
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
        "data": data
    }


@router.get("/monthly")
def monthly_report():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            d.EnglishMonthName,
            ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f
        JOIN dimdate d
            ON f.OrderDateKey=d.DateKey
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
        "data": data
    }