import React from "react";
import { Await, Link, Outlet, useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const PageA = () => {
  const characters = useLoaderData() as { characterCollection: Character[] };

  return (
    <div>
      <h2>Module A - Page A</h2>
      <React.Suspense fallback={<h4>Loading characters...</h4>}>
        <Await resolve={characters.characterCollection}>
          {(characters) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <ul>
                  {characters.map((character) => (
                    <li key={character.id}>
                      <Link to={`./${character.id}`}>{character.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Outlet />
            </div>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
};
