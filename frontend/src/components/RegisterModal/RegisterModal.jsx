import { useState } from "react";

import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

export default function RegisterModal({
  isOpen,
  onClose,
  onRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

onRegister({
  email,
  password,
  name,
})
  .catch((err) => {
    if (String(err).includes("409")) {
      setErrorMessage("This email is already registered.");
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
      title="Sign up"
       buttonText={isSubmitting ? "Signing up..." : "Sign up"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <label className="register-modal__label">
        Email
        <input
          className="register-modal__input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="register-modal__label">
        Password
        <input
          className="register-modal__input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <label className="register-modal__label">
        Username
        <input
          className="register-modal__input"
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      {errorMessage && (
        <p className="register-modal__error-message">
          {errorMessage}
        </p>
      )}
    </ModalWithForm>
  );
}