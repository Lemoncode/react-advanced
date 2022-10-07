import React from "react";
import { ToggleButton } from "./components/toggle-button.component";


export const App = () => {
  const [on, setOn] = React.useState(false);

  const handleToggle = () => {
    setOn(!on);
  };

  return <ToggleButton on={on} onToggle={handleToggle} />;
};
