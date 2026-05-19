from fastapi import FastAPI

app = FastAPI(title="News Explorer API")


@app.get("/")
def read_root():
    return {"message": "News Explorer API is running"}


@app.get("/health")
def check_health():
    return {"status": "ok"}