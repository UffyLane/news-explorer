import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import * as auth from "../../utils/auth";
import { saveArticle, searchNews, getSavedArticles, deleteArticle, } from "../../utils/newsApi";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SavedNews from "../SavedNews/SavedNews";
import SearchForm from "../SearchForm/SearchForm";
import NewsCardList from "../NewsCardList/NewsCardList";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Preloader from "../Preloader/Preloader";
import NothingFound from "../NothingFound/NothingFound";

function HomePage({  onSearch,
  articles,
  isLoading,
  searchError,
  onLoginClick,
  onSaveArticle,
  onLogout,
  savedArticles,
  hasSearched,
  
  
 }) {
  return (
    <>
      <Header onLoginClick={onLoginClick} onLogout={onLogout} />
      <main>
        <section className="hero">
          <h1 className="hero__title">What's going on in the world?</h1>
          <p className="hero__subtitle">
            Find the latest news on any topic and save them in your personal account.
          </p>
          <SearchForm onSearch={onSearch} />
        </section>

        {isLoading && <Preloader />}

{searchError && (
  <p className="app__error">{searchError}</p>
)}

{hasSearched &&
  !isLoading &&
  !searchError &&
  articles.length === 0 && (
    <NothingFound />
)}

{!isLoading && articles.length > 0 && (
  <NewsCardList
    articles={articles}
    onSaveArticle={onSaveArticle}
    savedArticles={savedArticles}
  />
)}
      </main>
      <Footer />
    </>
  );
}



export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) return;

    auth
      .getCurrentUser(token)
      .then((userData) => {
        setCurrentUser(userData);
        return getSavedArticles(token);
      })
       .then((savedArticlesData) => {
      setSavedArticles(savedArticlesData || []);
    })
    .catch(() => {
      localStorage.removeItem("jwt");
      setCurrentUser(null);
    });
}, []);

  function handleSearch(query) {
    setIsLoading(true);
    setSearchError("");
    setHasSearched(true);


    searchNews(query)
  .then((data) => {
    const articlesWithKeyword = (data.articles || []).map((article) => ({
      ...article,
      searchKeyword: query,
    }));

    setArticles(articlesWithKeyword);
  })
      .catch((err) => {
        console.error(err);
        setSearchError("Something went wrong while searching for news.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleSaveArticle(article) {
  const token = localStorage.getItem("jwt");

  if (!token) {
    setActiveModal("login");
    return;
  }

  const existingArticle = savedArticles.find(
    (savedArticle) => savedArticle.link === article.url
  );

  if (existingArticle) {
    deleteArticle(existingArticle.id, token)
      .then(() => {
        setSavedArticles((currentArticles) =>
          currentArticles.filter(
            (savedArticle) => savedArticle.id !== existingArticle.id
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });

    return;
  }

  saveArticle(article, article.searchKeyword || "general", token)
    .then((savedArticle) => {
      setSavedArticles((currentArticles) => [
        ...currentArticles,
        savedArticle,
      ]);
    })
    .catch((err) => {
      console.error(err);
    });
}

  function handleOpenLoginModal() {
    setActiveModal("login");
  }

  function handleOpenRegisterModal() {
    setActiveModal("register");
  }

  function handleCloseModal() {
    setActiveModal(null);
  }

  function handleRegister(userData) {
    auth
      .signup(userData)
      .then(() => {
        setActiveModal("login");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleLogin(userData) {
    auth
      .signin(userData)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        return auth.getCurrentUser(data.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        setActiveModal(null);
      })
      .catch((err) => {
        console.error(err);
      });
  }
function handleLogout() {
  localStorage.removeItem("jwt");
  setCurrentUser(null);
}
  

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
  onSearch={handleSearch}
  articles={articles}
  isLoading={isLoading}
  searchError={searchError}
  onLoginClick={handleOpenLoginModal}
  onSaveArticle={handleSaveArticle}
  onLogout={handleLogout}
  savedArticles={savedArticles}
  hasSearched={hasSearched}
/>
            }
          />
         <Route
  path="/saved-news"
  element={
    <ProtectedRoute isLoggedIn={!!currentUser}>
      <SavedNews onLogout={handleLogout} />
    </ProtectedRoute>
  }
/>
        </Routes>

        <LoginModal
          isOpen={activeModal === "login"}
          onClose={handleCloseModal}
          onLogin={handleLogin}
          onRegisterClick={handleOpenRegisterModal}
        />

        <RegisterModal
          isOpen={activeModal === "register"}
          onClose={handleCloseModal}
          onRegister={handleRegister}
        />
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
}