from fastapi import FastAPI
from app.database import engine
from app import models
from app.routes.users import router as user_router
# Create database tables
models.Base.metadata.create_all(bind=engine)
=======
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_connection

app = FastAPI(
    title="MetricMind API",
    version="1.0.0"
)
app.include_router(user_router)

# CORS Configuration
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

    return {"status": "OK"}


@app.get("/dashboard")
def dashboard():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            ROUND(SUM(SalesAmount),2) AS total_sales,
            COUNT(DISTINCT SalesOrderNumber) AS total_orders,
            COUNT(DISTINCT CustomerKey) AS total_customers
        FROM factinternetsales;
    """)

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result


@app.get("/sales")
def sales():
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

    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return {"sales": result}