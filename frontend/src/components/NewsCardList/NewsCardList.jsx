import NewsCard from "../NewsCard/NewsCard";
import "./NewsCardList.css";

export default function NewsCardList({ articles, onSaveArticle }) {
  return (
    <section className="news-card-list">
      <h2 className="news-card-list__title">Search results</h2>

      <div className="news-card-list__grid">
        {articles.map((article) => (
          <NewsCard
            key={article.url}
            article={article}
            onSaveArticle={onSaveArticle}
          />
        ))}
      </div>
    </section>
  );
}