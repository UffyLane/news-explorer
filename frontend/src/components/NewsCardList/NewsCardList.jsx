import NewsCard from "../NewsCard/NewsCard";
import "./NewsCardList.css";

export default function NewsCardList({
  articles,
  onSaveArticle,
  onDeleteArticle,
  isSavedNewsPage,
  savedArticles,
}) {
  return (
    <section className="news-card-list">
      <h2 className="news-card-list__title">
        {isSavedNewsPage ? "Saved articles" : "Search results"}
      </h2>

      <div className="news-card-list__grid">
       {articles.map((article, index) => {
  const isSaved = savedArticles?.some(
    (savedArticle) => savedArticle.link === article.url
  );

  return (
    <NewsCard
      key={article.id || article._id || `${article.url}-${index}`}
      article={article}
      onSaveArticle={onSaveArticle}
      onDeleteArticle={onDeleteArticle}
      isSavedNewsPage={isSavedNewsPage}
      isSaved={isSaved}
    />
  );
})}
      </div>
    </section>
  );
}