from fastapi import FastAPI
from app.database import engine
from app import models
from app.routes.users import router as user_router
# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MetricMind API",
    version="1.0.0"
)
app.include_router(user_router)


@app.get("/")
def home():
    return {"message": "MetricMind API is running"}


@app.get("/health")
def health():
    return {"status": "OK"}