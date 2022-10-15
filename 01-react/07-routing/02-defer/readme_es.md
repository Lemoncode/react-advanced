# 00 Load Fetch

## Resumen

No mostrar la pantalla mientras se cargan los datos puede ser algo poco
usable, vamos a mostrar la página y jugar con React.Suspense.

## Paso a Paso

- Partimos del ejemplo anterior

```bash
npm install
```

Y en la parte de rutas en la que hacemos el load, vamos a añadir
un _defer_ (https://reactrouter.com/en/main/utils/defer)

_./src/module-a/routes.tsx_

```diff
import React from "react";
- import { RouteObject } from "react-router-dom";
+ import { defer, RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleALayout } from "./module-a.layout";
import { getCharacterCollection } from "./character-collection.api";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
-        loader: () => getCharacterCollection(""),
+        loader: () => defer({characterCollection: getCharacterCollection("")}),
        element: <PageA />,
      },
```

Vamos ahora la página en concreto y vamos a añadir un _Suspense_ para indicar
que estamos cargando.

_/src/modules/module-a/a.page.tsx_

```diff
import React from "react";
- import { useLoaderData } from "react-router-dom";
+ import { Await, useLoaderData } from "react-router-dom";
import { Character } from "./model";

export const PageA = () => {
-  const characters = useLoaderData() as Character[];
+  const characters = useLoaderData() as {characterCollection: Character[]};


  return (
    <div>
      <h2>Module A - Page A</h2>
+     <React.Suspense
+         fallback={<h4>Loading characters...</h4>}
+     >
+      <Await
+        resolve={characters.characterCollection}
+      >
+     {characters => (
        <ul>
          {characters.map((character) => (
            <li key={character.id}>{character.name}</li>
          ))}
        </ul>
+      )}
+       </Await>
+      </React.Suspense>
    </div>
  );
};
```
