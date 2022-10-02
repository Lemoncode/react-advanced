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

---

la API loca... con el interval.
