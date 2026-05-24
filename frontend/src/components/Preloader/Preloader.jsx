import "./Preloader.css";

export default function Preloader() {
  return (
    <section className="preloader">
      <div className="preloader__spinner" />
      <p className="preloader__text">Searching for news...</p>
    </section>
  );
}