import { BASE_URL } from "./constants";

function handleResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }

  return res.json();
}

export function searchNews(query) {
  return fetch(`${BASE_URL}/news/search?q=${query}`)
    .then(handleResponse);
}