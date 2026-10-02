"""Fetch a saved article's page and extract readable text.

The article `link` is supplied by the client when an article is saved, so it
must be treated as untrusted input. Fetching an arbitrary URL from the server
is a classic SSRF (server-side request forgery) risk: without checks, someone
could save a link like http://169.254.169.254/ or http://localhost:5432/ and
make the backend read internal services. Every hop is therefore validated
before any request is made.

Known limitation: the hostname is resolved to check it, then resolved again by
`requests` when connecting. A hostile DNS server could answer differently the
second time (DNS rebinding). Closing that fully means pinning the connection to
the validated IP; that is left as a documented follow-up.
"""

import ipaddress
import socket
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

MAX_REDIRECTS = 3
MAX_BYTES = 1_500_000
MAX_CHARS = 12_000
MIN_USEFUL_CHARS = 500
REQUEST_TIMEOUT_SECONDS = 8
ALLOWED_PORTS = {None, 80, 443}
USER_AGENT = "NewsExplorerBot/1.0 (+summary feature)"

NOISE_TAGS = ["script", "style", "noscript", "nav", "header", "footer", "aside", "form"]


class UnsafeUrlError(ValueError):
    """The URL points somewhere the server must not fetch from."""


def _assert_public_http_url(url: str) -> None:
    parsed = urlparse(url)

    if parsed.scheme not in ("http", "https"):
        raise UnsafeUrlError("Only http and https links can be fetched")

    if not parsed.hostname:
        raise UnsafeUrlError("Link has no hostname")

    if parsed.port not in ALLOWED_PORTS:
        raise UnsafeUrlError("Unexpected port")

    try:
        addresses = {info[4][0] for info in socket.getaddrinfo(parsed.hostname, None)}
    except socket.gaierror as error:
        raise UnsafeUrlError("Hostname could not be resolved") from error

    for address in addresses:
        ip = ipaddress.ip_address(address)
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        ):
            raise UnsafeUrlError("Link resolves to a non-public address")


def _download_html(url: str) -> str | None:
    current = url

    for _ in range(MAX_REDIRECTS + 1):
        _assert_public_http_url(current)

        response = requests.get(
            current,
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT_SECONDS,
            allow_redirects=False,  # follow manually so each hop is re-validated
            stream=True,
        )

        try:
            if response.is_redirect:
                location = response.headers.get("Location")
                if not location:
                    return None
                current = urljoin(current, location)
                continue

            if response.status_code != 200:
                return None

            if "html" not in response.headers.get("Content-Type", "").lower():
                return None

            body = b""
            for chunk in response.iter_content(chunk_size=65_536):
                body += chunk
                if len(body) > MAX_BYTES:
                    break

            return body.decode(response.encoding or "utf-8", errors="replace")
        finally:
            response.close()

    return None  # too many redirects


def extract_readable_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(NOISE_TAGS):
        tag.decompose()

    root = soup.find("article") or soup.body or soup
    paragraphs = [
        paragraph.get_text(" ", strip=True) for paragraph in root.find_all("p")
    ]
    # Very short <p> tags are almost always captions, bylines or menu leftovers.
    text = "\n".join(p for p in paragraphs if len(p) >= 40)

    return text[:MAX_CHARS]


def fetch_article_text(url: str) -> str | None:
    """Return readable article text, or None if it can't be fetched safely.

    Never raises for expected failures (unsafe link, paywall, timeout, thin
    page); the caller falls back to the saved snippet instead.
    """
    try:
        html = _download_html(url)
    except (UnsafeUrlError, requests.RequestException):
        return None

    if not html:
        return None

    text = extract_readable_text(html)

    return text if len(text) >= MIN_USEFUL_CHARS else None
