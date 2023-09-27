import React from "react";
import "./app.css";

export const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("");
  const menuRef = React.useRef<HTMLUListElement>(null);
  useClickOutside({
    ref: menuRef,
    onClickOutside: () => {
      setIsOpen(false);
    },
  });

  const handleSelectColor = (color: string) => () => {
    setColor(color);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Choose color</button>
      <button onClick={() => setColor("")}>Reset color</button>
      {isOpen && (
        <ul ref={menuRef}>
          <li onClick={handleSelectColor("red")}>Red</li>
          <li onClick={handleSelectColor("green")}>Green</li>
          <li onClick={handleSelectColor("blue")}>Blue</li>
        </ul>
      )}
      <p>Selected color: {color}</p>
    </>
  );
};

interface ClickOutsideProps {
  ref: React.MutableRefObject<HTMLElement>;
  onClickOutside: () => void;
}

export const useClickOutside = (props: ClickOutsideProps) => {
  const { ref, onClickOutside } = props;

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current?.contains(event.target)) {
        onClickOutside();
      }
    };

    // Assign handleClickOutside to the whole document mousedown events.
    // Using mousedown because click fires after both the mousedown and mouseup events have fired, in that order.
    // That is, if you use click event, the handleClickOutside method will be fired after click Choose color button.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref.current]);
};
