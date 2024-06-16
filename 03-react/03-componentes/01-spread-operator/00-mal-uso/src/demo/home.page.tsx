import React from "react";

import { MyForm } from "./my-form.component";

export const HomePage = () => {
  const [name, setName] = React.useState("Pepe");
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  return (
    <div>
      <MyForm name={name} onChange={setName} time={time}/>
    </div>
  );
};
