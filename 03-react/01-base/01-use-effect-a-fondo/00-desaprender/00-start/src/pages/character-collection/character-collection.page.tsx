import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState<Character[]>([]);

  React.useEffect(() => {
    getCharacterCollection().then((characters) => setCharacters(characters));
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
