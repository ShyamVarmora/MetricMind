from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, get_connection
from app import models
from app.routes.analytics import router as analytics_router
from app.routes.users import router as user_router
from app.routes.reports import router as reports_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetricMind API",
    description="Authentication APIs for MetricMind Backend",
    version="1.0.0"
)

app.include_router(user_router)
app.include_router(reports_router)
app.include_router(analytics_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "MetricMind API is running"}


@app.get("/health")
def health():
    return {"status": "OK"}


@app.get("/dashboard")
def dashboard():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Summary
    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount),2) AS total_sales,
            COUNT(DISTINCT SalesOrderNumber) AS total_orders,
            COUNT(DISTINCT CustomerKey) AS total_customers
        FROM factinternetsales;
    """)
    summary = cursor.fetchone()

    # Monthly Sales
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

    # Top Products
    cursor.execute("""
        SELECT
            p.EnglishProductName,
            ROUND(SUM(f.SalesAmount),2) AS sales
        FROM factinternetsales f
        JOIN dimproduct p
            ON f.ProductKey = p.ProductKey
        GROUP BY p.EnglishProductName
        ORDER BY sales DESC
        LIMIT 5;
    """)
    top_products = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "success": True,
        "data": {
            "summary": summary,
            "monthly_sales": monthly_sales,
            "top_products": top_products
        }
    }