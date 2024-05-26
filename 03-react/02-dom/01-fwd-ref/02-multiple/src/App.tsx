import React from "react";
import { TwoInput } from "./common/twoinput.component";

export default function App() {
  const [firstName, setFirstName] = React.useState("");
  const [secondName, setSecondName] = React.useState("");
  const inputARef = React.useRef<HTMLInputElement>(null);
  const inputBRef = React.useRef<HTMLInputElement>(null);

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
          inputARef.current?.focus();
        }}
      >
        Set focus to first name
      </button>
      <button
        onClick={() => {
          inputBRef.current?.focus();
        }}
      >
        Set focus to second name
      </button>
    </div>
  );
}
