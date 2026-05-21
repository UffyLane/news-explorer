import { useContext } from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Header.css";

export default function Header({ onLoginClick }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <header className="header">
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
            <button className="header__user-button" type="button">
              {currentUser.name}
            </button>
          </>
        ) : (
          <button className="header__signin-button" type="button" onClick={onLoginClick}>
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}