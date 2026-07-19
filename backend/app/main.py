from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "MetricMind API is running"}

@app.get("/health")
def health():
    return {"status": "OK"}
@app.get("/sales")
def get_sales():
    return {
        "sales": [
            {
                "month": "January",
                "revenue": 150000
            },
            {
                "month": "February",
                "revenue": 185000
            },
            {
                "month": "March",
                "revenue": 210000
            }
        ]
    }
@app.get("/dashboard")
def get_dashboard():
    return {
        "total_sales": 545000,
        "orders": 324,
        "customers": 185,
        "growth": "12%"
    }
