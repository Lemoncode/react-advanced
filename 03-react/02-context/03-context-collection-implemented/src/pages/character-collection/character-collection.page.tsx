import React from "react";
import { Link } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
import { useCharacterCollectionContext } from "@/core/providers/character-collection";
import { useDebounce } from "use-debounce";
import { useCharacterFilterContext } from "@/core/providers/character-filter/character-filter.context";

export const CharacterCollectionPage = () => {
  const cache = useCharacterFilterContext();
  const characterCollectionContext = useCharacterCollectionContext();
  const [filter, setFilter] = React.useState(cache.filter);
  const [filterDebounced] = useDebounce(filter, 500);
  const [characters, setCharacters] = React.useState<Character[]>(
    characterCollectionContext.characters
  );

  const loadCharacters = async () => {
    const characters = await trackPromise(
      getCharacterCollection(filterDebounced),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };

  const handleFilterChange = (newValue: string) => {
    setFilter(newValue);
    cache?.setFilter(newValue);
  };

  React.useEffect(() => {
    loadCharacters();
  }, [filterDebounced]);

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter</label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
      ></input>
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
