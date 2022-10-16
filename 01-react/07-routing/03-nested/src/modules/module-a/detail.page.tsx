import React from "react";
import { useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const DetailPage: React.FunctionComponent = () => {
  const data = useLoaderData() as { character: Character };
  const character = useLoaderData() as Character;

  return (
    <div>
      <h1>Detail</h1>
      {character && (
        <div>
          <img src={character.image} />
          <h2>{character.name}</h2>
          <p>{character.status}</p>
        </div>
      )}
    </div>
  );
};
