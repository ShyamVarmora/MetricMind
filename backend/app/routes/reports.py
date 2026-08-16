from fastapi import APIRouter, Depends
from app.database import get_connection
from app.auth import get_current_user
from app.models import User

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


# =========================
# SALES REPORT
# =========================

@router.get("/sales")
def sales_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            order_date AS date,
            ROUND(SUM(sales_amount), 2) AS sales
        FROM factinternetsales
        GROUP BY order_date
        ORDER BY order_date;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Sales report fetched successfully",
        "data": data
    }


# =========================
# REVENUE REPORT
# =========================

@router.get("/revenue")
def revenue_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            ROUND(SUM(sales_amount), 2) AS totalRevenue
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


# =========================
# CUSTOMER REPORT
# =========================

@router.get("/customer")
def customer_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            COUNT(DISTINCT customer_name) AS totalCustomers
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


# =========================
# MONTHLY REPORT
# =========================

@router.get("/monthly")
def monthly_report(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            DATE_FORMAT(order_date, '%Y-%m') AS month,
            ROUND(SUM(sales_amount), 2) AS sales
        FROM factinternetsales
        GROUP BY DATE_FORMAT(order_date, '%Y-%m')
        ORDER BY month;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Monthly report fetched successfully",
        "data": data
    }