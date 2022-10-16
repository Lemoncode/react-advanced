import React from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const DetailPage: React.FunctionComponent = () => {
  const data = useLoaderData() as { character: Character };

  return (
    <div>
      <h1>Detail</h1>
      <React.Suspense fallback={<h4>Loading character...</h4>}></React.Suspense>
      <Await resolve={data.character}>
        {(character) => (
          <div>
            <img src={character.image} />
            <h2>{character.name}</h2>
            <p>{character.status}</p>
          </div>
        )}
      </Await>
    </div>
  );
};
