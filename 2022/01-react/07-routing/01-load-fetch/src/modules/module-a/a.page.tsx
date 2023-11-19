import React from "react";
import { useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const PageA = () => {
  const characters = useLoaderData() as Character[];

  return (
    <div>
      <h2>Module A - Page A</h2>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
};
