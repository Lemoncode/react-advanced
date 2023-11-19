import React from "react";
import { CharacterCollectionContext } from "./character-collection.context";
import { Character } from "@/pages/character-collection/character-collection.model";

interface Props {
  children: React.ReactNode;
}

export const CharacterCollectionContextProvider: React.FunctionComponent<
  Props
> = (props) => {
  const { children } = props;
  const [characters, setCharacters] = React.useState<Character[]>([]);

  return (
    <CharacterCollectionContext.Provider
      value={{
        characters,
        setCharacters,
      }}
    >
      {children}
    </CharacterCollectionContext.Provider>
  );
};
