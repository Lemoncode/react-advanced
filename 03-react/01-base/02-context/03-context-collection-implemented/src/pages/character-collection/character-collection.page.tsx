import React from "react";
import { useFilterHook, useCharacters } from "./character-collection.hook";
import { FilterComponent, CharacterCollectionComponent } from "./components";

export const CharacterCollectionPage = () => {
  const { filter, filterDebounced, handleFilterChange } = useFilterHook();
  const { characters, loadCharacters } = useCharacters();

  React.useEffect(() => {
    loadCharacters(filterDebounced);
  }, [filterDebounced]);

  return (
    <>
      <h1>Character Collection</h1>
      <FilterComponent filter={filter} onFilterChange={handleFilterChange} />
      <CharacterCollectionComponent characters={characters} />
    </>
  );
};
