import "./NothingFound.css";

export default function NothingFound() {
  return (
    <section className="nothing-found">
      <div className="nothing-found__icon">🔍</div>

      <h2 className="nothing-found__title">Nothing found</h2>

      <p className="nothing-found__text">
        Sorry, but nothing matched your search terms.
      </p>
    </section>
  );
}