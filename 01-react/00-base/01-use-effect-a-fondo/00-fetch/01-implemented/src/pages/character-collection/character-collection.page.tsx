import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState<Character[]>([]);

  React.useEffect(() => {
    getCharacterCollection(filter).then((characters) => {
      setCharacters(characters);
    });
  }, [filter]);

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter </label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
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
