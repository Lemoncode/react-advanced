import React from "react";
import classes from "./modal.module.css";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

export const Modal: React.FC<Props> = (props) => {
  const { children, isOpen, handleClose } = props;

  React.useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? handleClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div className={classes.modalHeader}>
          <button className={classes.closeBtn} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className={classes.modalContent}>{children}</div>
      </div>
    </div>
  );
};
