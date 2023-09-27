import * as React from "react";
import { InputInfo } from "./components/input-info.component";

export const App = () => {
  const [value, setValue] = React.useState("");
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  return (
    <div>
      <InputInfo
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="El campo es obligatorio"
        type="password"
      />
    </div>
  );
};
