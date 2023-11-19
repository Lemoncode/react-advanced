import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const PageA = () => {
  const characters = useLoaderData() as { characterCollection: Character[] };

  return (
    <div>
      <h2>Module A - Page A</h2>
      <React.Suspense fallback={<h4>Loading characters...</h4>}>
        <Await resolve={characters.characterCollection}>
          {(characters) => (
            <ul>
              {characters.map((character) => (
                <li key={character.id}>{character.name}</li>
              ))}
            </ul>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
};
