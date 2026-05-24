import { useContext, useEffect, useState } from "react";

import Header from "../Header/Header";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { deleteArticle, getSavedArticles } from "../../utils/newsApi";
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
        isSavedNewsPage
      />
    </main>
  </>
);
}