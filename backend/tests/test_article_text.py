import socket
from unittest.mock import MagicMock, patch

import pytest

from app.services import article_text
from app.services.article_text import (
    UnsafeUrlError,
    _assert_public_http_url,
    extract_readable_text,
    fetch_article_text,
)

PUBLIC_IP = "93.184.216.34"


def fake_dns(mapping):
    def _getaddrinfo(host, *args, **kwargs):
        if host in mapping:
            return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (mapping[host], 0))]
        raise socket.gaierror("unknown host")

    return _getaddrinfo


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/",
        "http://localhost/",
        "http://10.0.0.5/admin",
        "http://192.168.1.10/",
        "http://169.254.169.254/latest/meta-data/",
        "http://[::1]/",
        "file:///etc/passwd",
        "ftp://news.example/x",
        "https://news.example:5432/",
        "http:///nohost",
    ],
)
def test_unsafe_urls_are_rejected(url):
    with patch("socket.getaddrinfo", fake_dns({"news.example": PUBLIC_IP})):
        with pytest.raises(UnsafeUrlError):
            _assert_public_http_url(url)


def test_public_url_is_allowed():
    with patch("socket.getaddrinfo", fake_dns({"news.example": PUBLIC_IP})):
        _assert_public_http_url("https://news.example/story")


def test_hostname_resolving_to_private_ip_is_rejected():
    with patch("socket.getaddrinfo", fake_dns({"sneaky.example": "10.1.2.3"})):
        with pytest.raises(UnsafeUrlError):
            _assert_public_http_url("https://sneaky.example/")


def test_redirect_to_internal_address_is_blocked():
    redirect = MagicMock(is_redirect=True, headers={"Location": "http://127.0.0.1:8080/secret"})

    with patch("socket.getaddrinfo", fake_dns({"news.example": PUBLIC_IP})), patch.object(
        article_text.requests, "get", return_value=redirect
    ) as get:
        assert fetch_article_text("https://news.example/story") is None

    assert get.call_count == 1  # the internal hop was never requested


def test_unsafe_link_never_makes_a_request():
    with patch.object(article_text.requests, "get") as get:
        assert fetch_article_text("http://169.254.169.254/") is None
    get.assert_not_called()


def test_extract_drops_noise_and_short_paragraphs():
    html = """
    <html><body>
      <nav><p>Home About Contact us today for more information please</p></nav>
      <script>var x = "ignore me ignore me ignore me ignore me ignore me";</script>
      <article>
        <p>Photo: staff</p>
        <p>The city council voted on Tuesday to approve the new transit plan after months of debate.</p>
        <p>Supporters said the plan would cut commute times across the metro area significantly.</p>
      </article>
    </body></html>
    """
    text = extract_readable_text(html)
    assert "city council" in text and "commute times" in text
    assert "Photo: staff" not in text
    assert "ignore me" not in text
    assert "Contact us" not in text


def test_thin_pages_return_none():
    page = MagicMock(is_redirect=False, status_code=200,
                     headers={"Content-Type": "text/html"}, encoding="utf-8")
    page.iter_content.return_value = [b"<html><body><p>Subscribe to keep reading this story.</p></body></html>"]

    with patch("socket.getaddrinfo", fake_dns({"news.example": PUBLIC_IP})), patch.object(
        article_text.requests, "get", return_value=page
    ):
        assert fetch_article_text("https://news.example/paywalled") is None


def test_full_page_returns_article_text():
    paragraph = "<p>The regional transit authority approved a sweeping expansion of bus service this week.</p>"
    page = MagicMock(is_redirect=False, status_code=200,
                     headers={"Content-Type": "text/html; charset=utf-8"}, encoding="utf-8")
    page.iter_content.return_value = [f"<html><body><article>{paragraph * 12}</article></body></html>".encode()]

    with patch("socket.getaddrinfo", fake_dns({"news.example": PUBLIC_IP})), patch.object(
        article_text.requests, "get", return_value=page
    ):
        text = fetch_article_text("https://news.example/story")

    assert text and "transit authority" in text
