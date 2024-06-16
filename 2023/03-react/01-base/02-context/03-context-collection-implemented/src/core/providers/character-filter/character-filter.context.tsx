import { createContext, useContext } from "react";

interface ContextProps {
  filter: string;
  setFilter: (filter: string) => void;
}

// asignamos un objeto por si el filtro crece en un futuro
export const CharacterFilterContext = createContext<ContextProps | null>(null);

export const useCharacterFilterContext = (): ContextProps => {
  const context = useContext(CharacterFilterContext);
  if (!context) {
    throw new Error(
      "useCharacterFilterContext must be used within a CharacterFilterProvider"
    );
  }
  return context;
};
