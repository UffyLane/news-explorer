import requests
from fastapi import HTTPException

from app.core.config import settings


GNEWS_API_URL = "https://gnews.io/api/v4/search"


def search_news(query: str):
    if not settings.news_api_key or settings.news_api_key == "your_news_api_key_here":
        raise HTTPException(status_code=500, detail="GNews API key is not configured")

    params = {
        "q": query,
        "apikey": settings.news_api_key,
        "lang": "en",
        "country": "us",
        "max": 10,
        "sortby": "publishedAt",
    }

    response = requests.get(GNEWS_API_URL, params=params, timeout=10)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to fetch news from GNews",
        )

    data = response.json()

    return data.get("articles", [])