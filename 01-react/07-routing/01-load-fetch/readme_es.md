# 00 Load Fetch

## Resumen

Un tema interesante que incorporar React Router son los loaders.

No permiten cargar una serie de datos (llamadas asíncronas) y que
cuando mostremos la página ya lo tengamos todo listo.

Esto no esta mal para una página, pero cobra todo el sentido cuando anidemos
varias vistas en una misma página.

## Paso a Paso

- Partimos del ejemplo anterior

```bash
npm install
```

- Y en el modulo A vamos a añadir una api para leer la lista de caracteres de Rick & Morty (ojo le hemos añadido una latencia
  de 1 a 3 segundos a cosa hecha):

_./src/modules/module-a/model.ts_

```ts
export interface Character {
  id: number;
  name: string;
  type: string;
  status: string;
  gender: string;
  image: string;
}
```

_./src/modules/module-a/character-collection.api.ts_

```ts
import { Character } from "./model";

// add random value to simulate network latency (bad connection), between 1 and 5 seconds
const randomLatency = () => Math.floor(Math.random() * 5 + 1) * 1000;

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
```

En el area de las rutas vamos añadir la propiedad _loader_
en la ruta de _module-a_:

_./src/modules/module-a/route.tsx_

```diff
import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleALayout } from "./module-a.layout";
+ import { getCharacterCollection } from "./character-collection.api";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
+      loader: () => getCharacterCollection(""),
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
```

Y ahora en la página podemos leer los datos de la ruta:

_./src/modules/module-a/a.page.tsx_

```diff
import React from "react";
+ import { useLoaderData } from 'react-router-dom';

export const PageA = () => {
+ const characters = useLoaderData() as Character[];

  return (
    <div>
      <h2>Module A - Page A</h2>
+     <ul>
+       {characters.map((character) => (
+         <li key={character.id}>{character.name}</li>
+       ))}
+     </ul>
    </div>
  );
};
```

Funciona, pero la usabilidad es rara, no se muestra nada mientras
la página está cargando, podemos mostrar un indicador de carga.

Una opción es ponerlo en el root..., para ello podemos anidar
las vistas debajo del raíz y poner un componente que haya de
layout principal.

_./src/root.layout.tsx_

```tsx
import React from "react";
import { Outlet, useNavigation } from "react-router-dom";

export const RootLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "loading" && <h5>⏱ Loading...</h5>}
      <Outlet />
    </>
  );
};
```

Y ahora vamos a por la estructura de rutas:

_./src/core/routes.tsx_

```diff
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../home.page";
import { routesModuleA } from "../modules/module-a";
import { routesModuleB } from "../modules/module-b";
+ import { rootLayout } from "../root.layout";

export const appRoutes = createBrowserRouter([
  {
    path: "/",
-    element: <HomePage />,
+   element: <rootLayout />,
+   children: [
+     {
+       path: "/",
+       element: <HomePage />,
+     },
+     ...routesModuleA,
+     ...routesModuleB,
+   ]
  },
-  ...routesModuleA,
-  ...routesModuleB,
]);
```

> En el próximo ejemplo veremos como tratar el defer directamente en la página anidada.
