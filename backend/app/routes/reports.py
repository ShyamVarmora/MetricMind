from fastapi import APIRouter, Depends, HTTPException
from app.database import get_connection
from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/api/reports", tags=["Reports"])


def _close(conn, cursor):
    if cursor:
        cursor.close()
    if conn:
        conn.close()


@router.get("/sales")
def sales_report(current_user: User = Depends(get_current_user)):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                COUNT(DISTINCT SalesOrderNumber) AS total_orders,
                ROUND(COALESCE(SUM(SalesAmount), 0), 2) AS total_sales,
                ROUND(COALESCE(SUM(SalesAmount), 0) / NULLIF(COUNT(DISTINCT SalesOrderNumber), 0), 2)
                    AS average_order_value
            FROM factinternetsales
        """)
        data = cursor.fetchone() or {}
        return {"success": True, "message": "Sales report fetched successfully", "data": data}
    except Exception as exc:
        print("Sales report error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load sales report")
    finally:
        _close(conn, cursor)


@router.get("/revenue")
def revenue_report(current_user: User = Depends(get_current_user)):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                ROUND(COALESCE(SUM(SalesAmount), 0), 2) AS total_revenue,
                ROUND(COALESCE(AVG(SalesAmount), 0), 2) AS average_revenue
            FROM factinternetsales
        """)
        data = cursor.fetchone() or {}
        return {"success": True, "message": "Revenue report fetched successfully", "data": data}
    except Exception as exc:
        print("Revenue report error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load revenue report")
    finally:
        _close(conn, cursor)


@router.get("/customer")
def customer_report(current_user: User = Depends(get_current_user)):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                COUNT(DISTINCT CustomerKey) AS total_customers,
                COUNT(DISTINCT SalesOrderNumber) AS total_orders,
                ROUND(COALESCE(SUM(SalesAmount), 0) / NULLIF(COUNT(DISTINCT SalesOrderNumber), 0), 2)
                    AS average_order_value
            FROM factinternetsales
        """)
        data = cursor.fetchone() or {}
        return {"success": True, "message": "Customer report fetched successfully", "data": data}
    except Exception as exc:
        print("Customer report error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load customer report")
    finally:
        _close(conn, cursor)


@router.get("/monthly")
def monthly_report(current_user: User = Depends(get_current_user)):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                CONCAT(d.CalendarYear, '-', LPAD(d.MonthNumberOfYear, 2, '0')) AS month,
                COUNT(DISTINCT f.SalesOrderNumber) AS orders,
                ROUND(COALESCE(SUM(f.SalesAmount), 0), 2) AS sales
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey = d.DateKey
            GROUP BY d.CalendarYear, d.MonthNumberOfYear
            ORDER BY d.CalendarYear, d.MonthNumberOfYear
        """)
        data = cursor.fetchall()
        return {"success": True, "message": "Monthly report fetched successfully", "data": data}
    except Exception as exc:
        print("Monthly report error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load monthly report")
    finally:
        _close(conn, cursor)
