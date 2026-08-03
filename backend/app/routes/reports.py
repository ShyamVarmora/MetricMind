from fastapi import APIRouter, Depends
from app.database import get_connection
from app.auth import get_current_user
from app.models import User

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/sales")
def sales_report(
    current_user: User = Depends(get_current_user)
):
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
        "message": "Sales report fetched successfully",
        "data": data
    }


@router.get("/revenue")
def revenue_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount),2) AS totalRevenue
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Revenue report fetched successfully",
        "data": data
    }


@router.get("/customer")
def customer_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            COUNT(DISTINCT CustomerKey) AS totalCustomers
        FROM factinternetsales;
    """)

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Customer report fetched successfully",
        "data": data
    }


@router.get("/monthly")
def monthly_report(
    current_user: User = Depends(get_current_user)
):
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
        "message": "Monthly report fetched successfully",
        "data": data
    }