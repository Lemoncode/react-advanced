import React from "react";
import { Link } from "react-router-dom";
import { useCharacterCollectionQuery } from "../../core/queries";

export const AnotherPage = () => {

  const query = useCharacterCollectionQuery("");

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter </label>
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
