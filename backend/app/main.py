from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.database import get_connection, get_db
from app.models import User
from app.routes.analytics import router as analytics_router
from app.routes.ask import router as ask_router
from app.routes.reports import router as reports_router
from app.schemas import UserCreate


app = FastAPI(title="MetricMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_router)
app.include_router(analytics_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {"success": True, "message": "MetricMind API is running"}


@app.get("/health")
def health():
    return {"success": True, "status": "healthy"}


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(name=user.name.strip(), email=email, hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"success": True, "message": "Registration successful"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return {"access_token": create_access_token(data={"sub": user.email}), "token_type": "bearer"}


@app.get("/profile")
def profile(current_user: User = Depends(get_current_user)):
    return {"success": True, "data": {"id": current_user.id, "name": current_user.name, "email": current_user.email}}


def _change_percent(current: float, previous: float) -> str:
    if previous == 0:
        return "—"
    return f"{((current - previous) / abs(previous)) * 100:+.1f}%"


@app.get("/dashboard")
def dashboard(current_user: User = Depends(get_current_user)):
    conn = cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT COALESCE(SUM(f.SalesAmount), 0) AS total_sales,
                   COUNT(DISTINCT f.SalesOrderNumber) AS orders,
                   COUNT(DISTINCT f.CustomerKey) AS customers,
                   COALESCE(SUM(f.SalesAmount), 0) - COALESCE(SUM(f.TotalProductCost), 0) - COALESCE(SUM(f.Freight), 0) AS profit
            FROM factinternetsales f
        """)
        summary = cursor.fetchone() or {}

        cursor.execute("""
            SELECT CONCAT(d.CalendarYear, '-', LPAD(d.MonthNumberOfYear, 2, '0')) AS month,
                   COALESCE(SUM(f.SalesAmount), 0) AS sales
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey = d.DateKey
            GROUP BY d.CalendarYear, d.MonthNumberOfYear
            ORDER BY d.CalendarYear, d.MonthNumberOfYear
        """)
        chart = [{"month": row["month"], "sales": float(row["sales"] or 0)} for row in cursor.fetchall()]

        cursor.execute("""
            SELECT CONCAT(d.CalendarYear, '-', LPAD(d.MonthNumberOfYear, 2, '0')) AS month,
                   COALESCE(SUM(f.SalesAmount), 0) AS sales,
                   COUNT(DISTINCT f.SalesOrderNumber) AS orders,
                   COALESCE(SUM(f.SalesAmount), 0) - COALESCE(SUM(f.TotalProductCost), 0) - COALESCE(SUM(f.Freight), 0) AS profit
            FROM factinternetsales f
            JOIN dimdate d ON f.OrderDateKey = d.DateKey
            GROUP BY d.CalendarYear, d.MonthNumberOfYear
            ORDER BY d.CalendarYear DESC, d.MonthNumberOfYear DESC
            LIMIT 2
        """)
        recent_months = cursor.fetchall()
        latest = recent_months[0] if recent_months else None
        previous = recent_months[1] if len(recent_months) > 1 else None

        cursor.execute("""
            SELECT f.SalesOrderNumber AS id,
                   CONCAT_WS(' ', c.FirstName, c.LastName) AS customer_name,
                   f.SalesAmount AS sales_amount,
                   d.FullDateAlternateKey AS order_date
            FROM factinternetsales f
            LEFT JOIN dimcustomer c ON f.CustomerKey = c.CustomerKey
            LEFT JOIN dimdate d ON f.OrderDateKey = d.DateKey
            ORDER BY f.OrderDateKey DESC, f.SalesOrderLineNumber DESC
            LIMIT 10
        """)
        transactions = [
            {"id": row["id"], "customer_name": row["customer_name"] or "Unknown customer", "sales_amount": float(row["sales_amount"] or 0), "order_date": row["order_date"], "status": "Recorded"}
            for row in cursor.fetchall()
        ]

        sales_change = _change_percent(float(latest["sales"]), float(previous["sales"])) if latest and previous else "—"
        orders_change = _change_percent(float(latest["orders"]), float(previous["orders"])) if latest and previous else "—"
        profit_change = _change_percent(float(latest["profit"]), float(previous["profit"])) if latest and previous else "—"

        return {"success": True, "data": {
            "total_sales": float(summary.get("total_sales", 0) or 0),
            "orders": int(summary.get("orders", 0) or 0),
            "customers": int(summary.get("customers", 0) or 0),
            "profit": float(summary.get("profit", 0) or 0),
            "salesChange": sales_change,
            "ordersChange": orders_change,
            "profitChange": profit_change,
            "chart": chart,
            "transactions": transactions,
        }}
    except Exception as exc:
        print("Dashboard database error:", exc)
        raise HTTPException(status_code=500, detail="Unable to load dashboard data")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
