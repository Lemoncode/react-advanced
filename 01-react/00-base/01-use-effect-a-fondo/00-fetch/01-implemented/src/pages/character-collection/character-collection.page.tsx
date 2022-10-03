import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");

  const query = useQuery(["characters", filter], () =>
    getCharacterCollection(filter)
  );

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
        {query.data?.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
