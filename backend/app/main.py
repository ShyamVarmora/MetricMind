from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "MetricMind API is running"}

@app.get("/health")
def health():
    return {"status": "OK"}