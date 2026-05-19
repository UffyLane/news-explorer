from fastapi import FastAPI

from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="News Explorer API")


@app.get("/")
def read_root():
    return {"message": "News Explorer API is running"}


@app.get("/health")
def check_health():
    return {"status": "ok"}