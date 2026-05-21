import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SavedNews from "../SavedNews/SavedNews";
import SearchForm from "../SearchForm/SearchForm";
import NewsCardList from "../NewsCardList/NewsCardList";
import { searchNews } from "../../utils/newsApi";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  function handleSearch(query) {
    setIsLoading(true);
    setSearchError("");

    searchNews(query)
      .then((data) => {
        setArticles(data.articles || []);
      })
      .catch((err) => {
        console.error(err);
        setSearchError("Something went wrong while searching for news.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <h1 className="hero__title">What's going on in the world?</h1>
          <p className="hero__subtitle">
            Find the latest news on any topic and save them in your personal account.
          </p>
          <SearchForm onSearch={handleSearch} />
        </section>

        {isLoading && <p className="app__status">Searching...</p>}
        {searchError && <p className="app__error">{searchError}</p>}
        {!isLoading && articles.length > 0 && <NewsCardList articles={articles} />}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/saved-news" element={<SavedNews />} />
      </Routes>
    </BrowserRouter>
  );
}