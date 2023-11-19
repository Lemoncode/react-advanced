import React from "react";
import { Character } from "@/pages/character-collection/character-collection.model.ts";

interface ContextProps {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}

export const CharacterCollectionContext =
  React.createContext<ContextProps | null>(null);

export const useCharacterCollectionContext = () => {
  const context = React.useContext(CharacterCollectionContext);
  if (!context) {
    throw new Error(
      "useCharacterCollectionContext must be used within a CharacterCollectionContextProvider"
    );
  }
  return context;
};
