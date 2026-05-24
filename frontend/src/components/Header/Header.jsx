import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Header.css";

export default function Header({ onLoginClick, onLogout }) {
  const currentUser = useContext(CurrentUserContext);
  const location = useLocation();

  const isSavedNewsPage = location.pathname === "/saved-news";

  return (
    <header
      className={`header ${
        isSavedNewsPage ? "header_theme_dark" : ""
      }`}
    >
      <Link className="header__logo" to="/">
        NewsExplorer
      </Link>

      <nav className="header__nav">
        <Link className="header__link" to="/">
          Home
        </Link>

        {currentUser ? (
          <>
            <Link className="header__link" to="/saved-news">
              Saved articles
            </Link>

            <button
              className="header__user-button"
              type="button"
              onClick={onLogout}
            >
              {currentUser.name} ⎋
            </button>
          </>
        ) : (
          <button
            className="header__signin-button"
            type="button"
            onClick={onLoginClick}
          >
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}