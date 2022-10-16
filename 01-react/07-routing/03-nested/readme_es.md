# 00 Nested

## Resumen

Vamos a dar un punto más a las vistas anidadas. En este ejercicio vamos a crear una vista de detalle para cada uno de los personajes de la serie de televisión Rick and Morty y mostrarla en la misma página que la de
listado.

## Paso a Paso

- Partimos del ejemplo anterior

```bash
npm install
```

- Vamos a ampliar la API rest y añadir un metodo para carga
  los datos de un caracter por id.

_./src/modules/module-a/character-collection.api.ts_

```diff
export const getCharacterCollection = async (
  filter: string
): Promise<Character[]> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${filter}`
  );
  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};

+ export const getCharacter = async (id: string): Promise<Character> => {
+   const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
+   const data = await response.json();
+   await new Promise((resolve) => setTimeout(resolve, randomLatency()));
+
+   return data;
+ };
```

- Vamos a crear la página de detalle:

_./src/modules/module-a/detail.page.tsx_

```tsx
import React from "react";
import { useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const DetailPage: React.FunctionComponent = () => {
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
```

Y vamos a definir esto en la ruta:

_./src/module-a/routes.tsx_

```diff
import React from "react";
import { defer, RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleALayout } from "./module-a.layout";
- import { getCharacterCollection } from "./character-collection.api";
+ import { getCharacter, getCharacterCollection } from "./character-collection.api";
+ import { DetailPage } from "./detail.page";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
        loader: () =>
          defer({ characterCollection: getCharacterCollection("") }),
        element: <PageA />,
+       children: [
+         {
+           path: ":id",
+           loader: ({ params }) => getCharacter(params.id),
+           element: <DetailPage />,
+         },
+       ]
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
```

Y vamos añadir un _outlet_ en Page A.

_./src/modules/module-a/a.page.tsx_

```diff
import React from "react";
- import { Await, Outlet } from "react-router-dom";
+ import { Await, Outlet, useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const PageA = () => {
  const characters = useLoaderData() as { characterCollection: Character[] };

  return (
    <div>
      <h2>Module A - Page A</h2>
      <React.Suspense fallback={<h4>Loading characters...</h4>}>
        <Await resolve={characters.characterCollection}>
          {(characters) => (
+         <div style={{display: "flex", flexDirection: "row" }}>
+           <div>
              <ul>
                {characters.map((character) => (
                  <li key={character.id}>{character.name}</li>
                ))}
              </ul>
+            </div>
+            <Outlet/>
+         </div>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
};
```

- Vamos a añadir un enlace a la página de detalle en la lista de personajes.

_./src/modules/module-a/a.page.tsx_

```diff
+ import { Character } from "./model";
// (...)
                <ul>
                  {characters.map((character) => (
                    <li key={character.id}>
-                      {character.name}
+                       <Link to={`./${character.id}`}>{character.name}</a>
                    </li>
                  ))}
                </ul>
```

## Ejercicio

Vamos a meter un defer y un indicador de carga a la vista de detalle.
