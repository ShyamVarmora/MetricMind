from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import mysql.connector
import os

from dotenv import load_dotenv

from app.database import get_db
from app.models import User

from app.auth import (
    verify_password,
    create_access_token,
    get_current_user,
)

load_dotenv()


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="MetricMind API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME", "metricmind")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")


def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": "MetricMind API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy"
    }


# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                COALESCE(SUM(sales_amount), 0) AS total_sales,
                COUNT(*) AS orders,
                COUNT(DISTINCT customer_name) AS customers
            FROM factinternetsales
        """)

        summary = cursor.fetchone()

        if summary is None:
            summary = {
                "total_sales": 0,
                "orders": 0,
                "customers": 0
            }

        profit = 0
        profit_change = "0%"

        # ----------------------------------------------------
        # MONTHLY CHART
        # ----------------------------------------------------

        cursor.execute("""
            SELECT
                DATE_FORMAT(order_date, '%Y-%m') AS month,
                COALESCE(SUM(sales_amount), 0) AS sales
            FROM factinternetsales
            GROUP BY DATE_FORMAT(order_date, '%Y-%m')
            ORDER BY month
        """)

        chart_rows = cursor.fetchall()

        chart = []

        for row in chart_rows:
            chart.append({
                "month": row["month"],
                "sales": float(row["sales"] or 0)
            })

        # ----------------------------------------------------
        # RECENT TRANSACTIONS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT
                id,
                customer_name,
                sales_amount,
                order_date,
                status
            FROM factinternetsales
            ORDER BY order_date DESC, id DESC
            LIMIT 10
        """)

        transaction_rows = cursor.fetchall()

        transactions = []

        for row in transaction_rows:
            transactions.append({
                "id": row["id"],
                "customer_name": row["customer_name"],
                "sales_amount": float(
                    row["sales_amount"] or 0
                ),
                "order_date": (
                    row["order_date"].isoformat()
                    if row["order_date"]
                    else None
                ),
                "status": row["status"]
            })

        return {
            "success": True,
            "data": {
                "total_sales": float(
                    summary.get("total_sales", 0) or 0
                ),
                "orders": int(
                    summary.get("orders", 0) or 0
                ),
                "customers": int(
                    summary.get("customers", 0) or 0
                ),
                "profit": profit,
                "salesChange": "0%",
                "ordersChange": "0%",
                "profitChange": profit_change,
                "chart": chart,
                "transactions": transactions
            }
        }

    except mysql.connector.Error as e:
        print("Dashboard database error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to load dashboard data"
        )

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# SALES REPORT
# ============================================================

@app.get("/api/reports/sales")
def sales_report(
    current_user: User = Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(SUM(sales_amount), 0) AS total_sales,
                COALESCE(AVG(sales_amount), 0)
                    AS average_order_value
            FROM factinternetsales
        """)

        result = cursor.fetchone()

        return {
            "success": True,
            "report": "sales",
            "data": {
                "total_orders": int(
                    result["total_orders"] or 0
                ),
                "total_sales": float(
                    result["total_sales"] or 0
                ),
                "average_order_value": float(
                    result["average_order_value"] or 0
                )
            }
        }

    except mysql.connector.Error as e:
        print("Sales report error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to load sales report"
        )

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# REVENUE REPORT
# ============================================================

@app.get("/api/reports/revenue")
def revenue_report(
    current_user: User = Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                COALESCE(SUM(sales_amount), 0)
                    AS total_revenue,
                COALESCE(AVG(sales_amount), 0)
                    AS average_revenue
            FROM factinternetsales
        """)

        result = cursor.fetchone()

        return {
            "success": True,
            "report": "revenue",
            "data": {
                "total_revenue": float(
                    result["total_revenue"] or 0
                ),
                "average_revenue": float(
                    result["average_revenue"] or 0
                )
            }
        }

    except mysql.connector.Error as e:
        print("Revenue report error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to load revenue report"
        )

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# CUSTOMER REPORT
# ============================================================

@app.get("/api/reports/customer")
def customer_report(
    current_user: User = Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                COUNT(DISTINCT customer_name)
                    AS total_customers,
                COUNT(*) AS total_orders,
                COALESCE(AVG(sales_amount), 0)
                    AS average_order_value
            FROM factinternetsales
        """)

        result = cursor.fetchone()

        return {
            "success": True,
            "report": "customer",
            "data": {
                "total_customers": int(
                    result["total_customers"] or 0
                ),
                "total_orders": int(
                    result["total_orders"] or 0
                ),
                "average_order_value": float(
                    result["average_order_value"] or 0
                )
            }
        }

    except mysql.connector.Error as e:
        print("Customer report error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to load customer report"
        )

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# MONTHLY REPORT
# ============================================================

@app.get("/api/reports/monthly")
def monthly_report(
    current_user: User = Depends(get_current_user),
):
    conn = None
    cursor = None

    try:
        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute("""
            SELECT
                DATE_FORMAT(order_date, '%Y-%m')
                    AS month,
                COUNT(*) AS orders,
                COALESCE(SUM(sales_amount), 0)
                    AS sales
            FROM factinternetsales
            GROUP BY DATE_FORMAT(order_date, '%Y-%m')
            ORDER BY month
        """)

        rows = cursor.fetchall()

        data = []

        for row in rows:
            data.append({
                "month": row["month"],
                "orders": int(
                    row["orders"] or 0
                ),
                "sales": float(
                    row["sales"] or 0
                )
            })

        return {
            "success": True,
            "report": "monthly",
            "data": data
        }

    except mysql.connector.Error as e:
        print("Monthly report error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to load monthly report"
        )

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# PROFILE - GET
# ============================================================

@app.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "success": True,
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "created_at": (
                current_user.created_at.isoformat()
                if current_user.created_at
                else None
            ),
        },
    }


# ============================================================
# PROFILE - UPDATE
# ============================================================

@app.put("/profile")
def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        new_name = profile_data.get(
            "name",
            current_user.name
        ).strip()

        if not new_name:
            raise HTTPException(
                status_code=400,
                detail="Name cannot be empty"
            )

        current_user.name = new_name

        db.commit()
        db.refresh(current_user)

        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": {
                "id": current_user.id,
                "name": current_user.name,
                "email": current_user.email,
                "created_at": (
                    current_user.created_at.isoformat()
                    if current_user.created_at
                    else None
                ),
            },
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        print("Profile update error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to update profile"
        )