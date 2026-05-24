import "./SuccessModal.css";

export default function SuccessModal({ isOpen, onClose, onLoginClick }) {
  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="success-modal" onMouseDown={handleOverlayClick}>
      <div className="success-modal__container">
        <button className="success-modal__close" type="button" onClick={onClose}>
          ×
        </button>

        <h2 className="success-modal__title">
          Registration successfully completed!
        </h2>

        <button
          className="success-modal__login-button"
          type="button"
          onClick={onLoginClick}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}