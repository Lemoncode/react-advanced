# Hola React Query

Sabes que existe una librería brillante para gestionar consultas en React, se llama _React Query_.

Vamos a por un primer aperitivo, y después nos meteremos más en profundidad.

# Manos a la obra

Volvemos a React 18 :).

Vamos a copiar el ejemplo de arranca (carpeta 00-start, hermana de ésta)

Y vamos a instalar las dependencias:

```bash
npm install
```

Ejecutamos y todo fantástico:

```bash
npm run dev
```

Nos encontramos con el `infame` `useEffect` para la carga inicial de datos ¿Buscamos otra forma de tratar esto?

Para este caso vamos a estudiar _react-query_

_React Query_ nos permite:

- Sacar las consultas que hagamos fuera de los efectos de React.
- Nos permite cachear las consultas.
- Nos permite refrescar las consultas.
- Nos permite gestionar el estado de la consulta (_loading_, _error_, _data_).

Es decir, nos aporta una funcionalidad rica para manejar estos casos.

Antes de ponernos refactorizar el código, vamos a sacar a la luz un par de casos más que nos pueden dar problemas:

Vamos a simular que la api tiene un retraso en contestar (tenemos mala conexión o va cargado el servidor), introducimos un retraso aleatorio entre 1 y 5 segundos:

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

Si ahora cargamos, vemos el retraso la primera vez (todo ok), pero cuando navegamos a la página de detalle y volvemos, se nos carga la página de listado de actores en blanco, esto es una pena, ¿No podríamos tener almacenado la entrada anterior y al carga la página mostrar ese resultado mientras en _background_ se carga el nuevo?
Así daríamos mejor experiencia al usuario.

Esto lo podríamos hacer tirando de contexto y montando algo por nuestra cuenta,
pero si empiezas a afinarlo igual querrías:

- Que lo guardara en una caché.
- Que esa caché estuviera activa por X segundos.
- Que se recargara automáticamente al pasar X segundos, o si el usuario pierde el foco
  de la ventana y vuelve a ella.
- Si hacemos alguna "mutación", por ejemplo añadimos un nuevo actor.

Vamos que huele a que o nos arremangamos a hacer "_nuestra cosa_" o buscamos mejor algo ya hecho y robusto :).

Vamos a aprovechar esa latencia aleatoria que hemos introducido y vamos a hablar de condiciones de carrera.

¿Qué es una condición de carrera? Es un problema que se produce cuando dos o más hilos de ejecución (o procesos) acceden a la misma variable compartida y al menos uno de ellos escribe en ella. Si los hilos de ejecución no se sincronizan adecuadamente, el resultado final puede depender del orden en que se ejecutan los hilos de ejecución.

Vamos a verlo con un caso práctico, añadimos una caja de texto de filtrado para buscar nombres de caracteres:

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
+      <label htmlFor="filter">filter</label>
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

Veámoslo en acción, vamos a teclear "_alien_":

```bash
npm run dev
```

Igual tenemos que probar varias veces, pero fíjate que no siempre obtenemos los caracteres que empiezan por _ali_.

¿Qué está pasando aquí? Qué en algunas ocasionas la consulta _a_ o la _al_ llega después que la _alien_.

¿Qué podíamos hacer?

- Podríamos utilizar el parche anterior y cancelar consultas.
- Podríamos utilizar un _debounce_ para que no se lancen tantas consultas.

Todos estos parches pueden estar bien, pero lo suyo es que alguien se encargue
de gestionar esto por mí.

## React query

Vamos a remangarnos y ponernos con _React Query_ a ver cómo nos resuelve esto.

> Aquí vamos a tener una breve introducción, más adelante nos pondremos con un ejemplo más completo.

Vamos a instalar la dependencia:

```bash
npm i @tanstack/react-query
```

Vamos a añadir un _provider_ para las queries.

_./src/core/queries/query-client.ts_

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

Lo exponemos como barrel:

_./src/core/queries/index.ts_

```ts
export * from "./query-client";
```

Vamos a inicializarlo en nuestra app:

_./src/app.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
+ import { QueryClientProvider } from "@tanstack/react-query";
+ import { queryClient } from "./core/queries";
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

Y ahora vamos a darle uso en nuestra página de _characterCollection_

- Nos traemos el _hook_ de _useQuery_.
- _Wrapeamos_ la llamada a la API que ya teníamos en un _useQuery_ y en el
  el primer parámetro de tipo _array_:
  - Le damos un nombre a la _query_ (aquí sería buena idea usar constantes, y
    prefijos, ya que esa _query_ la podemos reusar).
  - Le pasamos el filtro de texto, fíjate que esto ya se queda como reactivo, si cambia el filtro se volverá a lanzar la consulta.

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

+  const query = useQuery({
+    queryKey: ["character-collection", filter],
+    queryFn: () => getCharacterCollection(filter),
+  });

-  React.useEffect(() => {
-    getCharacterCollection(filter).then((characters) => {
-      setCharacters(characters);
-    });
-  }, [filter]);
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { useQuery } from "@tanstack/react-query";
- import { Character } from "./character-collection.model";
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

Vamos a probar esto (ojo recuerda que hay un _delay random_ en la api)

- Fíjate que ya si podemos teclear "_alien_" y se quedará con la última.
- Si vamos a la página de detalle y volvemos a la colección, nos muestra
  el resultado de filtro vacío mientras ejecuta la consulta en _background_
  para traerse los datos actualizados.

Seguramente tengas un montón de dudas en estos momentos:

- Hay por ahí un string harcodeado... ¿Cómo funciona? Más adelante aprenderemos a estructurar esto.

- ¿Cómo se que es lo que está pasando? Hay unas React Query Dev Tools que son de gran ayuda.

Y bueno sobre el filtro, ¿Qué podíamos hacer para almacenar los datos del filtro más allá de la muerte de la página? Con lo que ya sabemos una opción podría ser almacenarlo en el contexto de React, OPCIONAL ejercicio guardar el filtro en contexto.

# EJERCICIO

Vamos a hacer lo mismo con character detail (también se puede hacer paso a paso y ver el truco del alias):

**Solución**

Y en el de _CharacterDetail_

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

+  // Aplicamos alias a _character_ a _data_
+  const { data : character } = useQuery({
+    queryKey: ["character", characterId],
+    queryFn: () => getCharacter(characterId ?? ''),
+  });

-  React.useEffect(() => {
-    getCharacter(characterId).then((character) => setCharacter(character));
-  }, []);

  return (
```

> Sobre optimizaciones y render: https://tkdodo.eu/blog/react-query-render-optimizations

De momento lo dejamos aquí y seguimos aprendiendo base, más adelante volveremos a _React Query_.
