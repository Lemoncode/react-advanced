import React from "react";
import { Link } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
import { useCharacterCollectionContext } from "@/core/providers/character-collection";

export const CharacterCollectionPage = () => {
  const characterCollectionContext = useCharacterCollectionContext();
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState<Character[]>(
    characterCollectionContext.characters
  );

  React.useEffect(() => {
    trackPromise(
      getCharacterCollection().then((characters) => {
        setCharacters(characters);
        characterCollectionContext.setCharacters(characters);
      })
    );
  }, []);

  return (
    <>
      <h1>Character Collection</h1>
      <Link to="/1">Character 1</Link>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
