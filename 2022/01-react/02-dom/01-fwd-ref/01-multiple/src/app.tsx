import React from "react";
import { TwoInput } from "./common/twoinput.component";

export function App() {
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");
  const inputARef = React.useRef(null);
  const inputBRef = React.useRef(null);

  return (
    <div className="App">
      <TwoInput
        labelA="First name"
        valueA={firstName}
        onChangeA={setFirstName}
        labelB="Second name"
        valueB={secondName}
        onChangeB={setSecondName}
        inputRefA={inputARef}
        inputRefB={inputBRef}
      />
      <button
        onClick={() => {
          if (inputARef.current) inputARef.current.focus();
        }}
      >
        Set focus to first name
      </button>
      <button
        onClick={() => {
          if (inputBRef.current) inputBRef.current.focus();
        }}
      >
        Set focus to second name
      </button>
    </div>
  );
}
