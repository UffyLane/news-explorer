import "./ModalWithForm.css";

export default function ModalWithForm({
  title,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
  children,
}) {
  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal" onMouseDown={handleOverlayClick}>
      <div className="modal__container">
        <button className="modal__close" type="button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal__title">{title}</h2>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          <button className="modal__submit" type="submit">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}