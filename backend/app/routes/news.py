from fastapi import APIRouter, Query

from app.services.news_api import search_news

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/search")
def search_articles(q: str = Query(..., min_length=1)):
    return {"articles": search_news(q)}