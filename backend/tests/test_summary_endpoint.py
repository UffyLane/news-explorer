from unittest.mock import patch

from tests.conftest import register_and_login

FULL_TEXT = "Chipmakers announced new fabs across three states. " * 20


def test_requires_authentication(client, saved_article):
    response = client.post(f"/articles/{saved_article['id']}/summary")
    assert response.status_code in (401, 403)


def test_missing_article_is_404(client, auth_headers):
    response = client.post("/articles/9999/summary", headers=auth_headers)
    assert response.status_code == 404


def test_cannot_summarize_someone_elses_article(client, saved_article):
    other = register_and_login(client, "b@example.com")
    response = client.post(f"/articles/{saved_article['id']}/summary", headers=other)
    assert response.status_code == 403


def test_503_when_no_api_key_configured(client, auth_headers, saved_article):
    with patch("app.routes.articles.fetch_article_text", return_value=None):
        response = client.post(
            f"/articles/{saved_article['id']}/summary", headers=auth_headers
        )
    assert response.status_code == 503


def test_falls_back_to_snippet_and_caches(client, auth_headers, saved_article):
    with patch("app.routes.articles.fetch_article_text", return_value=None), patch(
        "app.routes.articles.summarize_article", return_value="A short TL;DR."
    ) as summarize:
        first = client.post(f"/articles/{saved_article['id']}/summary", headers=auth_headers)
        second = client.post(f"/articles/{saved_article['id']}/summary", headers=auth_headers)

    assert first.json() == {"summary": "A short TL;DR.", "summary_basis": "snippet", "cached": False}
    assert second.json()["cached"] is True
    assert summarize.call_count == 1  # second click cost nothing

    # and the saved list now carries the summary
    listed = client.get("/articles", headers=auth_headers).json()
    assert listed[0]["summary"] == "A short TL;DR."
    assert listed[0]["summary_basis"] == "snippet"


def test_uses_full_text_when_page_is_fetchable(client, auth_headers, saved_article):
    with patch("app.routes.articles.fetch_article_text", return_value=FULL_TEXT), patch(
        "app.routes.articles.summarize_article", return_value="Full summary."
    ) as summarize:
        response = client.post(f"/articles/{saved_article['id']}/summary", headers=auth_headers)

    assert response.json()["summary_basis"] == "full_text"
    assert summarize.call_args.args[2] == FULL_TEXT
    assert summarize.call_args.args[3] == "full_text"
