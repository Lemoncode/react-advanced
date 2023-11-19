import React from "react";
import { useDebounce } from "use-debounce";
import { useCharacterFilterContext } from "@/core/providers/character-filter/character-filter.context";
import { trackPromise } from "react-promise-tracker";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
import { useCharacterCollectionContext } from "@/core/providers/character-collection";

export const useFilterHook = () => {
  const cache = useCharacterFilterContext();
  const [filter, setFilter] = React.useState(cache.filter);
  const [filterDebounced] = useDebounce(filter, 500);

  const handleFilterChange = (newValue: string) => {
    setFilter(newValue);
    cache?.setFilter(newValue);
  };

  return { filter, setFilter, filterDebounced, handleFilterChange };
};

export const useCharacters = () => {
  const characterCollectionContext = useCharacterCollectionContext();
  const [characters, setCharacters] = React.useState<Character[]>(
    characterCollectionContext.characters
  );

  const loadCharacters = async (filter: string) => {
    const characters = await trackPromise(
      getCharacterCollection(filter),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };

  return { characters, setCharacters, loadCharacters };
};
