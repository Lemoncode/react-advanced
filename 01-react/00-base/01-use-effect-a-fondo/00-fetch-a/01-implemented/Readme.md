# UseEffect - Fetch

Hasta ahora cuando nos ha hecho falta trabajar con React es muy normal usar el
hook `useEffect` para hacer peticiones a una API de datos, en este ejemplo
vamos a ver que problemas nos podemos encontrar

# Manos a la obra

Vamos a copiar el ejemplo de arranca (carpeta 00-start, hermana de ésta)

Y vamos a instalar las dependencias:

```bash
npm install
```

Ejecutamos y todo fantástico:

```bash
npm start
```

Vamos a mejorar un poco el código, es buena idea trabajar con React en modo estricto
(https://reactjs.org/docs/strict-mode.html), así que vamos a habilitarlo (esto sólo
se habilita en desarrollo, en producción se descarta de forma automática).

_./src/app.tsx_

```diff
export const App = () => {
  return (
+    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
        </Routes>
      </HashRouter>
+    </React.StrictMode>
  );
};
```

Si ahora depuramos o añadimos un console.log en el componente `CharacterCollectionPage` nos podemos encontrar con una sorpresa...

_./src/pages/character-collection/_

```diff
  React.useEffect(() => {
    getCharacterCollection().then((characters) => setCharacters(characters));
+   console.log('*** useEffect called ***');
  }, []);
```

Si te fijas esto se llama dos veces, y es algo normal...

- Resulta que esto lo introdujeron en React 18.
- Lo hacen para que podamos detectar mejor los errores.

Peeero... esto nos puede volver locos.

Podríamos implementar un parche y es ignorar la primera llamada, pero
esto no quita que no se haga la llamada dos veces, algo así como:

_./src/pages/character-collection/_

```diff
  React.useEffect(() => {
+   let ignore = false;
-    getCharacterCollection().then((characters) => setCharacters(characters));
+   getCharacterCollection().then((characters) => {
+    if (!ignore) {
+      setCharacters(characters);
+    }
+   });
-   console.log('*** useEffect called ***');
+   return () => {ignore = true};
  }, []);
```

> ¿Quien me explica como funciona este código?

Pero lo mejor... no es hacerlo así, sino intentar quitarse de enmedio
el useEffect para esto, Esto no lo digo yo, lo dicen:

- Dan Abramov: https://github.com/facebook/react/issues/24502
- La documentación oficial de Facebook nueva (puede que esté en beta,
  buscar aquí): https://beta.reactjs.org/learn/you-might-not-need-an-effect#fetching-data

El consejo es que usemos _useEffect_ para sincronizarnos con el mundo
exterior, no para traernos datos.

Antes de dar solución a esto, vamos a ahondar un poco más en los problemas
que tenemos de usar _useEffect_, vamos a quitar el hack del ignore y
el _strict.mode_ para ir identificando más problemas:

_./src/app.tsx_

```diff
export const App = () => {
  return (
-    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
        </Routes>
      </HashRouter>
-    </React.StrictMode>
  );
};
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
  React.useEffect(() => {
-    let ignore = false;

    getCharacterCollection().then((characters) => {
-      if (!ignore) {
        setCharacters(characters);
-      }
    });

-    return () => {
-      ignore = true;
-    };
  }, []);
```

¿Qué podemos hacer para traernos datos?

- Una opción sería un hacernos un custom hook para esto, pero, no
  dejamos de hacer dos llamadas en desarrollo y además, siendo
  un problema tan común ¿No habrá una solución más estándar?

- Usar una solucíon de tipo Framework, NextJs y Remix, en el caso de NextJs
  tenemos una opción que es _getInitialProps_ que se ejecuta en servidor.

- Utilizar una librería para gestionar consultas como _react-query_

Para este caso vamos a estudiar _react-query_

React Query nos permite:

- Sacar las consultas que hagamos fuera de los efectos de React.
- Nos permite cachear las consultas.
- Nos permite refrescar las consultas.
- Nos permite gestionar el estado de la consulta (loading, error, data).

Es decir nos aporta una funcionalidad rica para manejar estos casos.

Antes de ponernos refactorizar el código, vamos a sacar a la luz
un par de casos más que nos pueden dar problemas:

Vamos a simular que la api tiene un retraso en contestar (tenemos
mala conexión o va cargado el servidor), introducimos un retraso
aleatorio entre 1 y 5 segundos:

_./src/pages/character-collection/character-collection.api.ts_

```diff
import { Character } from "./character-collection.model";

+ // add random value to simulate network latency (bad connection), between 1 and 5 seconds
+ const randomLatency = () => Math.floor(Math.random() * 5 + 1) * 1000;

export const getCharacterCollection = async (): Promise<Character[]> => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
+ await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};
```

Si ahora cargamos, vemos el retraso la primera vez (todo ok), pero cuando navegamos
a la página de detalle y volvemos, se nos carga la página de listado de actores en
blanco, esto es una pena,¿No podríamos tener almacenado la entrada anterior y
al carga la página mostrar ese resultado mientras en background se carga el nuevo?
Así daríamos mejor experiencia al usuario.

Esto lo podríamos hacer tirando de contexto y montando algo por nuestra cuenta,
pero si empiezas a afinarlo igual querrías:

- Que lo guardara en una caché.
- Que esa cache estuviera activa por X segundos.
- Que se recargara automáticamente al pasar X segundos, o si el usuario pierde el foco
  de la ventana y vuelve a ella.
- Si hacemos alguna "mutación", por ejemplo añadimos un nuevo actor.

Vamos que huele a que o nos arremangamos a hacer "nuestra cosa" o buscamos mejor
algo ya hecho y robusto :).

Vamos a aprovechar esa latencia aleatoria que hemos introducido y vamos a hablar de
condiciones de carrera.

¿Qué es una condición de carrera? Es un problema que se produce cuando dos o más hilos de ejecución (o procesos) acceden a la misma variable compartida y al menos uno de ellos escribe en ella. Si los hilos de ejecución no se sincronizan adecuadamente, el resultado final puede depender del orden en que se ejecutan los hilos de ejecución.

Vamos a verlo con un caso práctico, añadimos una caja de texto de filtrado para
buscar nombres de caracteres:

_./src/pages/character-collection/character-collection.api.ts_

```diff
import { Character } from "./character-collection.model";

// add random value to simulate network latency (bad connection), between 1 and 5 seconds
const randomLatency = () => Math.floor(Math.random() * 5 + 1) * 1000;

- export const getCharacterCollection = async (): Promise<Character[]> => {
+ export const getCharacterCollection = async (filter : string): Promise<Character[]> => {

-  const response = await fetch("https://rickandmortyapi.com/api/character");
+  const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${filter}`);


  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};
```

Y en el componente:

_./src/pages/character-collection/character-collection.page.ts_

```diff
export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState<Character[]>([]);

  React.useEffect(() => {
-    getCharacterCollection().then((characters) => {
+    getCharacterCollection(filter).then((characters) => {
      setCharacters(characters);
    });
-  }, []);
+  }, [filter]);


  return (
    <>
      <h1>Character Collection</h1>
-      <Link to="/1">Character 1</Link>
+      <label to="filter">filter</label>
+      <input id="filter" value={filter} onChange={e => setFilter(e.target.value)}/>
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
```

Como ahora hemos metido el retraso aleatorio fíjate en lo que pasa:

- Se lanzan varias consultas en paralelo.
- Igual llega una del pasado y se cuela machacando a la nueva.

Veámoslo en acción, vamos a teclear "alien":

```bash
npm start
```

Igual tenemos que probar varias veces, pero fíjate que no siempre obtenemos
los caracteres que empiezan por _ali_

¿Qué esta pasando aquí? Que en algunas ocasionas la consulta _a_ o la _al_ llega
después que la _alien_

¿Qué podíamos hacer?

- Podríamos utilizar el parche anterior y cancelar consultas.
- Podríamos utilizar un _debounce_ para que no se lancen tantas consultas.

Todas estos parches pueden estar bien, pero lo suyo es que alguien se encargue
de gestionar esto por mi.

## React query

Vamos a remangarnos y ponernos con React Query a ver como nos resuelve esto

Vamos a instalar la dependencia:

```bash
npm i @tanstack/react-query
```

Vamos a añadir un _provider_ para las queries.

_./src/core/query-client.ts_

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

_./src/core/index.ts_

```ts
export * from "./query-client";
```

Vamos a inicializarlo en nuestra app:

_./src/App.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
+ import { QueryClientProvider } from "@tanstack/react-query";
+ import { queryClient } from "./core";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";

export const App = () => {
  return (
+    <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CharacterCollectionPage />} />
        <Route path="/:characterId" element={<CharacterDetailPage />} />
      </Routes>
    </HashRouter>
+   </QueryClientProvider>
  );
  );
};
```

Y ahora vamos a darle uso en nuestra página de characterCollection

- Nos traemos el hook de useQuery.
- Wrapeamos la llamada a la API que ya teníamos en un useQuery y en el
  el primer parámetro de tipo array:
  - Le damos un nombre a la query (aquí sería buena idea usar constantes, y
    prefijos, ya que esa query la podemos reusar).
  - Le pasamos el filtro de texto, fijate que esto ya se queda como reactivo, si cambia el filtro se volverá a lanzar la consulta.

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
+ import { useQuery } from "@tanstack/react-query";
import { Character } from "./character-collection.model";
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
-  const [characters, setCharacters] = React.useState<Character[]>([]);

+ const query = useQuery(["character-collection", filter], () => getCharacterCollection(filter));

-  React.useEffect(() => {
-    getCharacterCollection(filter).then((characters) => {
-      setCharacters(characters);
-    });
-  }, [filter]);
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
      <ul>
-        {characters.map((character) => (
+        {query.data?.map((character) => (

          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
```

Vamos a probar esto (ojo recuerda que hay un delay random en la api)

- Fíjate que ya si podemos teclear "alien" y se quedará con la última.
- Si vamos a la página de detalle y volvemos a la colección, nos muestra
  el resultado de filtro vacío mientras ejecuta la consultan en background
  para traerse los datos actualizados.

¿Qué podíamos hacer para almacenar los datos del filtro más allá de la
muerte de la página? Con lo que ya sabemos una opción podría ser almacenarlo
en el contexto de React, OPCIONAL ejercicio guardar el filtro en contexto.

EJERCICIO

Vamos a hacer lo mismo con character detail:

**Solución**

Y en el de CharacterDetail

_./src/pages/character-collection/character-detail.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
+ import { useQuery } from "@tanstack/react-query";
import { getCharacter } from "./character-detail.api";
import { Character } from "./character-detail.model";
```

_./src/pages/character-collection/character-detail.page.tsx_

```diff
export const CharacterDetailPage = () => {
-  const [character, setCharacter] = React.useState<Character>(null);
  const { characterId } = useParams();

+ const { data : character } = useQuery(["character", characterId], () => getCharacter(characterId));

-  React.useEffect(() => {
-    getCharacter(characterId).then((character) => setCharacter(character));
-  }, []);

  return (
```

> Sobre optimizaciones y render: https://tkdodo.eu/blog/react-query-render-optimizations

- Vamos a hacer una prueba, creamos una tercera página que va a mostrar la
  lista de personajes, pero sin filtrar..., en el fondo va a usar la misma query
  que en la página de colección, así que vamos a refactorizar a _core_ varias cosas.

> Ojo, si trabajamos con ViewModels tendríamos que crear una API intermedia y
> mappers.

_./src/core/queries/model.ts_

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

_./src/core/queries/character-collection.api.ts_

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

- Ya que estamos vamos a crear un custom hook para wrapear el useQuery

_./src/core/queries/character-collection.query.ts_

```ts
export const useCharacterCollectionQuery = (filter: string) => {
  return useQuery(["character-collection", filter], () =>
    getCharacterCollection(filter)
  );
};
```

- Añadimos un barrel:

_./src/core/queries/index.ts_

```diff
export * from "./query-client";
+ export * from "./character-collection.query";
+ export * from "./model";
```

- Ahora nos vamos a la página de characterCollection, hacemos limpia y usamos
  nuestro custom hook.

- Borramos model.ts (aquí podríamos discutir si tener un VM y mapeador dentro o si
  considerar que el model de core se considera ya un modelo de cliente común).

- Borramos el api (ya está en core).

- Ahora vamos a la página de detalle, hacemos limpia y usamos nuestro custom hook.

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { useQuery } from "@tanstack/react-query";
- import { getCharacterCollection } from "./character-collection.api";
- import { Character } from "./character-collection.model";
+ import {useCharacterCollectionQuery} from '../core/queries'

export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");

-  const query = useQuery(["characters", filter], () =>
-    getCharacterCollection(filter)
-  );

+  const query = useCharacterCollectionQuery(filter);

  return (
```

Vamos a ejecutar esto:

```bash
npm start
```

- Vamos a crear ahora la tercera página y veamos que ocurre:

- Tercera pagina:

_./src/pages/another/another.page.tsx_

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCharacterCollectionQuery } from "../../core/queries";

export const AnotherPage = () => {
  const query = useCharacterCollectionQuery("");

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter </label>
      <ul>
        {query.data?.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
```

- La añadimos al barrel:

_./src/pages/index.ts_

```diff
export * from "./character-collection/character-collection.page";
export * from "./character-detail/character-detail.page";
+ export * from "./another/another.page";
```

- La añadimos al router:

_./src/app.tsx_

```diff
- import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
+ import { CharacterCollectionPage, CharacterDetailPage, AnotherPage } from "./pages";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
+          <Route path="/another" element={<AnotherPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};
```

- Vamos a añadir un enlace desde la home:

_./src/pages/character-collection/character-collection.page.tsx_

```diff
  return (
    <>
      <h1>Character Collection</h1>
+      <div>
+       <Link to="/another">Link to Another page</Link>
+      </div>
      <label htmlFor="filter">filter </label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {query.data?.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
```

Probamos y vemos que tenemos carga instantánea de la página.

Para terminar, vamos a resolver el tema de los _magic string_ para los nombres de las
consultas, aquí podemos añadir un fichero de constantes:

Aquí hay un tema interesante:

- En estos ejemplos sencillos hemos añadido una key, y en el caso de pasar un parámetro,
  dos (la key y el parámetro en si).
- Es interesante añadir una tercera key para agrupar por areas, de esta forma podemos
  hacer cosas interesantes tales como invalidar todas las consultas de un área dada
  (por ejemplo todas las globales, o todas las de un pod dado).

Aunque, va a ser un overkill montar un sistema de este tipo para este proyecto, vamos
a por ello sobre todo con el objetivo de aprender.

_./src/core/queries/key-queries.ts_

```ts
export const coreKeys = {
  all: ["core"] as const,
  characterCollection: (filter: string) =>
    [...coreKeys.all, "core", "character-collection", filter] as const,
};
```

Y vamos a usarlo:

_./src/core/queries/character-collection.query.ts_

```diff
import { useQuery } from "@tanstack/react-query";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./model";
+ import { coreKeys } from './key-queries';

export const useCharacterCollectionQuery = (filter: string) => {
-  return useQuery(["character-collection", filter], () =>
+  return useQuery(coreKeys.characterCollection(filter), () =>
    getCharacterCollection(filter)
  );
};
```

> ¿Por qué lo del spread operator? La gracia de esto es encadenar, por ejemplo
> podrías tener todas las consulta de ese area identificada con _core_, pero a su
> vez crear una subcategoría de _listing_ y así podríamos de una tacada invalidar,
> por ejemplo todos los listados de ese area\_

Vamos a hacer lo mismo con el area de _character-detail_:

EJERCICIO

Solución

_./src/pages/character-detail/key-queries.ts_

```ts
export const characterDetailKeys = {
  all: ["character-detail"] as const,
  characterDetail: (id: string) =>
    [...characterDetailKeys.all, "character-profile", id] as const,
};
```

Y en la página:

_./src/pages/character-detail/character-detail.page.tsx_

```diff
import { getCharacter } from "./character-detail.api";
import { Character } from "./character-detail.model";
+ import { characterDetailKeys } from './key-queries';

export const CharacterDetailPage = () => {
  const { characterId } = useParams();

-  const { data: character } = useQuery(["character", characterId], () =>
+  const { data: character } = useQuery(characterDetailKeys.characterDetail(characterId), () =>
    getCharacter(characterId)
  );
```

Esto pinta bien, vamos a por un ejemplo en el que también hagamos actualizaciones e inserciones (siguiente ejemplo TODO list).

# Referencias

- Manejo de queries: https://tkdodo.eu/blog/effective-react-query-keys

- Cleaner data fetching with React Query: https://dev.to/siddharthvenkatesh/cleaner-data-fetching-with-react-query-4klg
