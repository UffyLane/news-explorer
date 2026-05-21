import { BASE_URL } from "./constants";

function handleResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }

  return res.json();
}

export function searchNews(query) {
  return fetch(`${BASE_URL}/news/search?q=${encodeURIComponent(query)}`).then(
    handleResponse
  );
}

export function getSavedArticles(token) {
  return fetch(`${BASE_URL}/articles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function saveArticle(article, keyword, token) {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      keyword,
      title: article.title,
      text: article.description || article.content || "",
      date: article.publishedAt,
      source: article.source?.name || "Unknown source",
      link: article.url,
      image: article.image || null,
    }),
  }).then(handleResponse);
}

export function deleteArticle(articleId, token) {
  return fetch(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}