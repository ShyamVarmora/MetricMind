from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, get_connection
from app import models
from app.models import User
from app.auth import get_current_user

from app.routes.users import router as user_router
from app.routes.reports import router as reports_router
from app.routes.analytics import router as analytics_router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetricMind API",
    description="Authentication APIs for MetricMind Backend",
    version="1.0.0"
)

# Register Routers
app.include_router(user_router)
app.include_router(reports_router)
app.include_router(analytics_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "MetricMind API is running"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "message": "Server is healthy"
    }


@app.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user)
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # ---------------- Summary ----------------
    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount),2) AS totalSales,
            COUNT(DISTINCT SalesOrderNumber) AS orders,
            COUNT(DISTINCT CustomerKey) AS customers
        FROM factinternetsales;
    """)
    summary = cursor.fetchone()

    # ---------------- Profit ----------------
    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount - TotalProductCost),2) AS profit
        FROM factinternetsales;
    """)
    profit = cursor.fetchone()

    # ---------------- Monthly Sales ----------------
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
    monthly_sales = cursor.fetchall()

    # ---------------- Recent Transactions ----------------
    cursor.execute("""
        SELECT
            SalesOrderNumber,
            CustomerKey,
            ROUND(SalesAmount,2) AS sales,
            OrderDateKey
        FROM factinternetsales
        ORDER BY OrderDateKey DESC
        LIMIT 10;
    """)
    recent_transactions = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": "Dashboard loaded successfully",
        "data": {
            "totalSales": summary["totalSales"],
            "orders": summary["orders"],
            "customers": summary["customers"],
            "profit": profit["profit"],
            "monthlySales": monthly_sales,
            "recentTransactions": recent_transactions
        }
    }