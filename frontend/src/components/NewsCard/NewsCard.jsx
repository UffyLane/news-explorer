import "./NewsCard.css";

export default function NewsCard({ article }) {
  return (
    <article className="news-card">
      <img
        className="news-card__image"
        src={article.image || "https://placehold.co/400x272"}
        alt={article.title}
      />
      <div className="news-card__content">
        <p className="news-card__date">{article.publishedAt}</p>
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__text">{article.description}</p>
        <p className="news-card__source">{article.source?.name}</p>
      </div>
    </article>
  );
}