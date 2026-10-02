import { useContext, useEffect, useState } from "react";

import Header from "../Header/Header";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import {
  deleteArticle,
  getSavedArticles,
  summarizeArticle,
} from "../../utils/newsApi";
import NewsCardList from "../NewsCardList/NewsCardList";
import "./SavedNews.css";

export default function SavedNews({onLogout}) {
  const currentUser = useContext(CurrentUserContext);
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) return;

    getSavedArticles(token)
      .then((articles) => {
        setSavedArticles(articles);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function handleDeleteArticle(article) {
  const token = localStorage.getItem("jwt");

  if (!token) return;

  deleteArticle(article.id, token)
    .then(() => {
      setSavedArticles((currentArticles) =>
        currentArticles.filter((savedArticle) => savedArticle.id !== article.id)
      );
    })
    .catch((err) => {
      console.error(err);
    });
}

  function handleSummarizeArticle(article) {
    const token = localStorage.getItem("jwt");

    if (!token) return Promise.reject(new Error("Not signed in"));

    return summarizeArticle(article.id, token).then((result) => {
      setSavedArticles((currentArticles) =>
        currentArticles.map((savedArticle) =>
          savedArticle.id === article.id
            ? {
                ...savedArticle,
                summary: result.summary,
                summary_basis: result.summary_basis,
              }
            : savedArticle
        )
      );
    });
  }

return (
  <>
    <Header onLogout={onLogout} />
    <main className="saved-news">
      <section className="saved-news__header">
        <p className="saved-news__label">Saved articles</p>
        <h1 className="saved-news__title">
          {currentUser?.name || "User"}, you have {savedArticles.length} saved articles
        </h1>
      </section>

      <NewsCardList
        articles={savedArticles}
        onDeleteArticle={handleDeleteArticle}
        onSummarizeArticle={handleSummarizeArticle}
        isSavedNewsPage
      />
    </main>
  </>
);
}