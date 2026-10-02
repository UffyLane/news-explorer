import os
import tempfile

# Must be set before the app is imported: tests run against a throwaway SQLite
# file, never the real database, and never a real Anthropic key.
_db_file = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{_db_file.name}"
os.environ["ANTHROPIC_API_KEY"] = ""
os.environ["JWT_SECRET"] = "test-secret"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)


def register_and_login(client, email="a@example.com"):
    client.post("/signup", json={"email": email, "name": "Test", "password": "Passw0rd!"})
    token = client.post("/signin", json={"email": email, "password": "Passw0rd!"}).json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers(client):
    return register_and_login(client)


@pytest.fixture
def saved_article(client, auth_headers):
    response = client.post(
        "/articles",
        headers=auth_headers,
        json={
            "keyword": "tech",
            "title": "Chip makers expand",
            "text": "A short excerpt about chip makers expanding capacity.",
            "date": "2026-09-01T00:00:00Z",
            "source": "Example News",
            "link": "https://news.example/chips",
        },
    )
    assert response.status_code == 201
    return response.json()
