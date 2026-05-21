from fastapi import FastAPI

from app import models
from app.database import Base, engine
from app.routes import auth
from app.routes import articles, auth, users, news
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="News Explorer API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users.router)
app.include_router(news.router)
app.include_router(articles.router)
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "News Explorer API is running"}


@app.get("/health")
def check_health():
    return {"status": "ok"}