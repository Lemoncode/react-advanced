import React from "react";
import { CharacterFilterContext } from "./character-filter.context";

interface Props {
  children: React.ReactNode;
}

export const CharacterFilterProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = React.useState("");
  return (
    <CharacterFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </CharacterFilterContext.Provider>
  );
};
