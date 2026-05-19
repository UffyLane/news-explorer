from fastapi import FastAPI

from app import models
from app.database import Base, engine
from app.routes import auth
from app.routes import auth, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="News Explorer API")
app.include_router(users.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "News Explorer API is running"}


@app.get("/health")
def check_health():
    return {"status": "ok"}