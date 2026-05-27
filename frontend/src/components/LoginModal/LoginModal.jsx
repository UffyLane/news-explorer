import { useState } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  onRegisterClick,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    onLogin({
      email,
      password,
    })
      .catch((err) => {
        if (String(err).includes("401")) {
          setErrorMessage("Incorrect email or password.");
        } else {
          setErrorMessage("Something went wrong.");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <ModalWithForm
      title="Sign in"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isSubmitting ? "Signing in..." : "Sign in"}
    >
      <label className="login-modal__label">
        Email
        <input
          className="login-modal__input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="login-modal__label">
        Password
        <input
          className="login-modal__input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {errorMessage && (
        <p className="login-modal__error-message">{errorMessage}</p>
      )}

      <button
        className="login-modal__switch"
        type="button"
        onClick={onRegisterClick}
      >
        Sign up
      </button>
    </ModalWithForm>
  );
}