import { useContext, useState } from "react";
import bookmarkIcon from "../../assets/icons/bookmark.svg";
import bookmarkFilledIcon from "../../assets/icons/bookmark-filled.svg";
import trashIcon from "../../assets/icons/trash.svg";
import { formatDate } from "../../utils/formatDate";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./NewsCard.css";

export default function NewsCard({
  article,
  onSaveArticle,
  onDeleteArticle,
  onSummarizeArticle,
  isSavedNewsPage,
  isSaved,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  function handleSaveClick() {
    if (!currentUser) return;

    onSaveArticle(article);
  }

  function handleDeleteClick() {
    onDeleteArticle(article);
  }

  function handleSummarizeClick() {
    setIsSummarizing(true);
    setSummaryError("");

    onSummarizeArticle(article)
      .catch((err) => {
        console.error(err);
        setSummaryError("Couldn't summarize this article. Please try again.");
      })
      .finally(() => {
        setIsSummarizing(false);
      });
  }

  return (
    <article className="news-card">
      <div className="news-card__image-container">
        <img
          className="news-card__image"
          src={article.image || "https://placehold.co/400x272"}
          alt={article.title}
        />

        {isSavedNewsPage ? (
          <button
  className="news-card__delete-button"
  type="button"
  onClick={handleDeleteClick}
>
  <img src={trashIcon} alt="Delete article" />
</button>
        ) : (
  <>
    {!currentUser && (
      <div className="news-card__tooltip">
        Sign in to save articles
      </div>
    )}

    <button
      className={`news-card__save-button ${
        currentUser ? "" : "news-card__save-button_disabled"
      } ${
        isSaved ? "news-card__save-button_saved" : ""
      }`}
      type="button"
      onClick={handleSaveClick}
    >
      <img
        src={isSaved ? bookmarkFilledIcon : bookmarkIcon}
        alt="Save article"
      />
    </button>
  </>
)
}
      </div>

      <div className="news-card__content">
        {isSavedNewsPage && (
          <p className="news-card__keyword">{article.keyword}</p>
        )}

        <p className="news-card__date">
          {formatDate(article.date || article.publishedAt)}
        </p>

        <h3 className="news-card__title">{article.title}</h3>

        <p className="news-card__text">
          {article.text || article.description}
        </p>

        {isSavedNewsPage && onSummarizeArticle && (
          <div className="news-card__summary">
            {article.summary ? (
              <>
                <p className="news-card__summary-label">TL;DR · AI summary</p>
                <p className="news-card__summary-text">{article.summary}</p>
                {article.summary_basis === "snippet" && (
                  <p className="news-card__summary-note">
                    Based on a short excerpt — the full article wasn't available.
                  </p>
                )}
              </>
            ) : (
              <button
                className="news-card__summary-button"
                type="button"
                onClick={handleSummarizeClick}
                disabled={isSummarizing}
              >
                {isSummarizing ? "Summarizing…" : "Summarize"}
              </button>
            )}
            {summaryError && (
              <p className="news-card__summary-error" role="alert">
                {summaryError}
              </p>
            )}
          </div>
        )}

        <p className="news-card__source">
          {article.source?.name || article.source}
        </p>
      </div>
    </article>
  );
}