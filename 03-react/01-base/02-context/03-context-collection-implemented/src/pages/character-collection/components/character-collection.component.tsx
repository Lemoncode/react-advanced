import React from "react";
import { Character } from "../character-collection.model";
import { Link } from "react-router-dom";

interface Props {
  characters: Character[];
}

export const CharacterCollectionComponent: React.FC<Props> = (props) => {
  const { characters } = props;

  return (
    <ul>
      {characters.map((character) => (
        <li key={character.id}>
          <Link to={`/${character.id}`}>{character.name}</Link>
        </li>
      ))}
    </ul>
  );
};
