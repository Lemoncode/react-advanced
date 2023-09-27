import React from "react";
import { Link } from "react-router-dom";
import { useCharacterCollectionQuery } from "../../core/queries";

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");

  const query = useCharacterCollectionQuery(filter);

  return (
    <>
      <h1>Character Collection</h1>
      <div>
        <Link to="/another">Link to Another page</Link>
      </div>
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
