import { useState } from "react";
import "./SearchForm.css";

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!query.trim()) return;

    onSearch(query.trim());
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-form__input"
        type="text"
        placeholder="Enter topic"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <button className="search-form__button" type="submit">
        Search
      </button>
    </form>
  );
}