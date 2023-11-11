import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { useQuery } from "@tanstack/react-query";
import { useCharacterFilterContext } from "@/core/providers/character-filter";

export const CharacterCollectionPage = () => {
  const cache = useCharacterFilterContext();
  const [filter, setFilter] = React.useState(cache?.filter ?? "");

  const query = useQuery({
    queryKey: ["character-collection", filter],
    queryFn: () => getCharacterCollection(filter),
  });

  const handleFilterChange = (filter: string) => {
    setFilter(filter);
    cache?.setFilter(filter);
  };

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter</label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
      />
      <ul>
        {query.data?.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
