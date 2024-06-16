import React from "react";
import "./App.css";

function App() {
  const inputARef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputARef.current?.focus();
  };

  return (
    <div>
      <input type="text" ref={inputARef} />
      <input type="text" />
      <button onClick={handleButtonClick}>Focus</button>
    </div>
  );
}

export default App;
