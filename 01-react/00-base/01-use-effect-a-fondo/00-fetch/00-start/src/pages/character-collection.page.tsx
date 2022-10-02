import React from "react";
import { Link } from "react-router-dom";

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${filter}`)
      .then((response) => response.json())
      .then((json) => setCharacters(json.results));
  });

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
