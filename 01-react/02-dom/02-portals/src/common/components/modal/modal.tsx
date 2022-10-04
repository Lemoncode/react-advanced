import React from "react";
import "./modal.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

export const Modal: React.FC<Props> = (props) => {
  const { children, isOpen, handleClose } = props;

  React.useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <button className="close-btn" onClick={handleClose}>
        Close
      </button>
      <div className="modal-content">{children}</div>
    </div>
  );
};
