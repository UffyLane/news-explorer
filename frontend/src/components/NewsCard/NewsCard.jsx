import { useContext } from "react";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./NewsCard.css";

export default function NewsCard({ article, onSaveArticle }) {
  const currentUser = useContext(CurrentUserContext);

  function handleSaveClick() {
    if (!currentUser) return;

    onSaveArticle(article);
  }

  return (
    <article className="news-card">
      <div className="news-card__image-container">
        <img
          className="news-card__image"
          src={article.image || "https://placehold.co/400x272"}
          alt={article.title}
        />

        <button
          className={`news-card__save-button ${
            currentUser ? "" : "news-card__save-button_disabled"
          }`}
          type="button"
          onClick={handleSaveClick}
        >
          🔖
        </button>
      </div>

      <div className="news-card__content">
        <p className="news-card__date">{article.publishedAt}</p>
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__text">{article.description}</p>
        <p className="news-card__source">{article.source?.name}</p>
      </div>
    </article>
  );
}