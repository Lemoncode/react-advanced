# Contexto y cache

Todo lo que hemos visto de React Query está muy bien, pero igual estás pensando... _El proyecto en el que estoy no me puedo poner a meter estas librerías ¿Hay algo que pueda hacer para mejorar la usabilidad de mi sitio?_

Vamos a utilizar el contexto de React para guardar el listado de actores y así cuando volvamos a la página de listado:

- Por un lado ya mostramos datos al usuario.
- Por otro hacemos una petición a la api en paralelo.
- De paso podemos mostrar una snack bar o simular para indicar que se están actualizando los datos.

La experiencia cambia mucho para el usuario, de algo que es vuelta a esperar, a una página operativa.

> Aquí podéis encontrar una pega y es van a haber uno o dos segundos en los que si el usuario ha modificado algo no lo va a ver, en React Query existe el concepto de update _optimista_ que nos permite actualizar los datos en la caché, y si hay algún problema invalidara, lo veremos más adelante :).

Cómo propina veremos como utilizar el hook _useDebounce_ para evitar que se hagan peticiones a la api a cada pulsación de tecla.

# Pasos

## Contexto y caché

Partimos del ejemplo en el que mostrábamos la lista de actores.

- Vamos a crear un contexto para guardar el listado de actores.

> Ojo aquí: por simplicidad vamos a importar la entidad de actor del modelo de api de _character-collection_ lo idea sería tener un modelo de contexto y utilizar un _mapper_ para convertir el modelo de api en el modelo de contexto (o que el modelo de api fuera simplemente un sinónimo del modelo de contexto).

_./src/core/providers/character-collection/character-collection.context.tsx_

```tsx
import React from "react";
import { Character } from "@pages/character-collection/character-collection.model.ts";

interface ContextProps {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}

export const CharacterCollectionContext =
  React.createContext<ContextProps | null>(null);

export const useCharacterCollectionContext = () => {
  const context = React.useContext(CharacterCollectionContext);
  if (!context) {
    throw new Error(
      "useCharacterCollectionContext must be used within a CharacterCollectionContextProvider"
    );
  }
  return context;
};
```

- Ahora vamos a crear el provider:

_./src/core/providers/character-collection/character-collection.provider.tsx_

```tsx
import React from "react";
import { CharacterCollectionContext } from "./character-collection.context";
import { Character } from "@/pages/character-collection/character-collection.model";

interface Props {
  children: React.ReactNode;
}

export const CharacterCollectionContextProvider: React.FunctionComponent<
  Props
> = (props) => {
  const { children } = props;
  const [characters, setCharacters] = React.useState<Character[]>([]);

  return (
    <CharacterCollectionContext.Provider
      value={{
        characters,
        setCharacters,
      }}
    >
      {children}
    </CharacterCollectionContext.Provider>
  );
};
```

Añadimos el barrel:

_./src/core/providers/character-collection/index.ts_

```tsx
export * from "./character-collection.context";
export * from "./character-collection.provider";
```

- Esta vez si lo instanciamos directamente en el _app.tsx_:

_./src/app.tsx_

```diff
import { HashRouter, Routes, Route } from "react-router-dom";
+ import { CharacterCollectionContextProvider } from "@/core/providers/character-collection";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";

export const App = () => {
  return (
+  <CharacterCollectionContextProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CharacterCollectionPage />} />
        <Route path="/:characterId" element={<CharacterDetailPage />} />
      </Routes>
    </HashRouter>
+ </CharacterCollectionContextProvider>
  );
};
```

Y vamos a darle uso:

- Cada vez que se cargan datos en el listado de actores, vamos a guardarlos en el contexto.
- Cuando volvemos a la página comprobamos si hay datos en el contexto, los asignamos y en paralelo hacemos una petición a la api.

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
+ import { useCharacterCollectionContext } from "@/core/providers/character-collection";
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
export const CharacterCollectionPage = () => {
+ const characterCollectionContext = useCharacterCollectionContext();
  const [filter, setFilter] = React.useState("");
-  const [characters, setCharacters] = React.useState<Character[]>([]);
+ const [characters, setCharacters] = React.useState<Character[]>(characterCollectionContext.characters);

  React.useEffect(() => {
-    getCharacterCollection().then((characters) => setCharacters(characters));
+   getCharacterCollection().then((characters) => {
+     setCharacters(characters);
+     characterCollectionContext.setCharacters(characters);
+   });
  }, []);
```

Con esto conseguimos que la primera vez que se carga la página se muestren datos, y en paralelo se haga una petición a la api, para el usuario es una experiencia mucho mejor.

Para que se note en rendimiento, volvemos a añadir el delay random en la api:

_./src/pages/character-collection/character-collection.api.ts_

```diff

+ // add random value to simulate network latency (bad connection), between 1 and 3 seconds
+ const randomLatency = () => Math.floor(Math.random() * 3 + 1) * 1000;

export const getCharacterCollection = async (): Promise<Character[]> => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
+  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};
```

Aquí tenemos dos peros:

- Si el usuario ha modificado algo, no lo va a ver hasta que se haga la petición a la api, aquí podemos mostrar un mensaje de _actualizando datos_.
- Si el usuario está editando algo y la llamada a la API es lenta puede que lo pierda:
  - Esto es un caso arista (lo normal es que la llamada a la api sea rápida).
  - Si ayuda de librerías como _React Query_ (que tienen el concepto de update optimista), se puede hacer un poco cuesta arriba, tendríamos que marcar las filas han sido editadas y hacer un merge.

Para probar una solución sencilla que es tener un flag de _loadInprogress_, ponerlo a true cuando se va a hacer la llamada, y a false cuando se recibe la respuesta, pero esto tiene algunas pegas:

- Lo suyo sería tratar tanto si la petición tiene éxito como si no (para que no se quede el spinner infinito a true).
- Otro tema común es que a veces para cargar los datos de una página tenemos que realizar varios peticiones a APIs rest, en este caso, si jugamos con sólo un flag y ponerlo a true/false, no podemos controlarlo bien, hay que llevar un contador, o jugar con promise.all

Para esto hay una solución sencilla que se llama _react-promise-tracker_ que nos permite tener un contador de peticiones pendientes y mostrar un spinner.

- Instalamos la librería:

```bash
npm install react-promise-tracker --save
```

- Vamos a crear un componente que muestre un mensaje en la parte de abajo de la pantalla indicando que se están cargando datos (no queremos que sea bloqueante).

_./src/common/components/spinner/spinner.component.module.css_

```css
.spinner {
  width: 100%;
  height: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
  background-color: blue;
}
```

_./src/common/components/spinner/spinner.component.tsx_

```tsx
import { usePromiseTracker } from "react-promise-tracker";

export const SpinnerComponent = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div className="spinner">
        <div className="spinner-border text-primary" role="status">
          <span>⏳ Actualizando datos...</span>
        </div>
      </div>
    )
  );
};
```

Lo metemos en un barrel:

_./src/common/components/spinner/index.ts_

```tsx
export * from "./spinner.component";
```

Vamos a instanciar este componente a nivel de aplicación:

_./src/app.tsx_

```diff
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
+ import { SpinnerComponent } from "@/common/components/spinner";

export const App = () => {
  return (
+  <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<CharacterCollectionPage />} />
        <Route path="/:characterId" element={<CharacterDetailPage />} />
      </Routes>
    </HashRouter>
+   <SpinnerComponent />
+  </>
  );
};
```

Y vamos a trackear la promesa en la página de actores:

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
+ import { trackPromise } from "react-promise-tracker";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
```

_./src/pages/character-collection/character-collection.page.tsx_

```diff
  React.useEffect(() => {
-    getCharacterCollection().then((characters) => setCharacters(characters));
+   trackPromise(
+     getCharacterCollection().then((characters) => {
+       setCharacters(characters);
+       characterCollectionContext.setCharacters(characters);
+     })
+    );
  }, []);
```

Este código cuesta un poco de leer ¿Intentamos hacerlo más legible?

_./src/pages/character-collection/character-collection.page.tsx_

```diff
  React.useEffect(() => {
-   trackPromise(
-     getCharacterCollection().then((characters) => {
-       setCharacters(characters);
-       characterCollectionContext.setCharacters(characters);
-     })
-    );
+   const promise = trackPromise(getCharacterCollection());
+   promise.then((characters) => {
+     setCharacters(characters);
+     characterCollectionContext.setCharacters(characters);
+   });
  }, [])
```

Si te fijas no estamos usando _async / await_ ¿Por qué? Porque no podemos usarlo en el _useEffect_, para poder usarlo tendríamos que hacer lo siguiente:

- Crear una función asíncrona.
- Llamarla desde el _useEffect_.

```diff
+ const loadCharacters = async () => {
+   const characters = await trackPromise(getCharacterCollection());
+   setCharacters(characters);
+   characterCollectionContext.setCharacters(characters);
+ };
+
  React.useEffect(() => {
-   const promise = trackPromise(getCharacterCollection());
-   promise.then((characters) => {
-     setCharacters(characters);
-     characterCollectionContext.setCharacters(characters);
-   });
+   loadCharacters();
  }, [])
```

> ¿Qué versión te parece mejor?

> Esta limitación de useEffect hace que ciertos desarrolladores no quieran usar _async/await_ esa y que también es relativamente fácil que se te olvide poner el _await_, y la lies parda :), por otro lado _async/await_ te deja un código muy lineal.

Por otro lado, como nos ha quedado el código, podríamos sacar a un custom hook la funcionalidad relativa a la carga de actores, ¿Es esto buena idea? DEPENDE:

- En este caso seguramente no, de momento tenemos poco código y parece que no sea algo que podamos reusar.
- Si el componente se hiciera más grande:
  - Podría ser buena idea "vaciar el cangrejo", aquí la idea no es hacer un custom hook que saque todo el código del componente, si no organizar por trozos de custom hooks grupos de funcionalidad.
  - También puede ser buena idea si quiero implementar unit tests (suele ser más sencillo probar un hook que un componente).
  - Y pueden ser trozos que igual se podría reusar en otros componentes.

Si probamos ahora vemos que está funcionando, pero se nos queda una espinita clavada, y es... ¿Qué pasa si hay páginas o consultas a la API que si deben de bloquear el interfaz de usuario hasta que se resuelvan y otras que no? Para eso podemos usar la áreas:

- Definir un area para bloquear el interfaz de usuario.
- Definir otra para no bloquear el interfaz de usuario (que se muestre el mensaje abajo).

Vamos a crear un área para las llamadas no bloqueantes:

_./src/common/components/spinner/spinner.component.tsx_

```diff
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";

export const SpinnerComponent = () => {
-  const { promiseInProgress } = usePromiseTracker();
+ // TODO: mover a una zona de contantes "non-blocking-area"
+ const { promiseInProgress } = usePromiseTracker({area: "non-blocking-area"});

  return (
    promiseInProgress && (
```

Y en el track:

_./src/pages/character-collection/character-collection.page.tsx_

```diff
  React.useEffect(() => {
   trackPromise(
     getCharacterCollection().then((characters) => {
       setCharacters(characters);
       characterCollectionContext.setCharacters(characters);
-     });
+    }, { area: "non-blocking-area" });
  }, []);
```

Así podríamos tener:

- Un spinner para bloqueantes y otros para no bloqueantes.
- También podríamos tener spinners dedicados para bloquear porciones de la pantalla.

Otro tema interesante es que normalmente la conexión a internet suele ser muy rápido y el spinner mete más ruido que otra cosa (hacer como flickering) ¿Por qué no mostrarlo sólo si han pasado más de 500 milisegundos?

Vamos a configurarlo:

_./src/common/components/spinner/spinner.component.tsx_

```diff
export const SpinnerComponent = () => {
 // TODO: mover a una zona de contantes "non-blocking-area"
- const { promiseInProgress } = usePromiseTracker({area: "non-blocking-area"});
+ const { promiseInProgress } = usePromiseTracker({area: "non-blocking-area", delay: 500});

  return (
    promiseInProgress && (
```

Si ahora eliminamos el retraso que metimos, verás que ni se llega a mostrar el spinner.

_./src/pages/character-collection/character-collection.api.ts_

```diff
export const getCharacterCollection = async (): Promise<Character[]> => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
-  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};
```

## UseDebounce

Tirar esto sin filtrado no tiene mucha merito, vamos poner el filtrado en funcionamiento de nuevo.

Esto lo ponemos como **ejercicio** (tenéis el resultado anterior para ir copiando e integrando):

Algunas pistas:

- Esto ya lo tenemos resuelto de antes.
- Te hará falta copiar lo que haya de filtro en _core/providers/character-filter_
- Te hará falta instanciar el provider a nivel de aplicación.
- En la página de actores:
  - Te hará falta añadir el handler para filtrar.
  - Te hará falta utilizar el hook _useCharacterFilterContext_ en la página de actores, tanto para leer el último filtro y asignarselo al estado, como para guardar el filtro en el contexto cuando se modifique.
  - IMPORTANTE... hay que cambiar la API para que admita parametros (acuerdate de copiar eso también).

> ¿Qué creéis que es mejor? ¿Tener un contexto para el filtro y otro para el listado, o un contexto para ambas propiedades?

Ya que tenemos el filtro operativo, vamos a hacer que la petición a la api se haga cuando el usuario deje de escribir, para ello vamos a utilizar el hook _useDebounce_.

- Instalamos la librería:

```bash
npm install use-debounce --save
```

- En la página que muestra el listado y el filtro hacemos uso de este hook:

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
+ import { useDebounce } from "use-debounce";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
```

```diff
export const CharacterCollectionPage = () => {
  const cache = useCharacterFilterContext();
  const characterCollectionContext = useCharacterCollectionContext();
  const [filter, setFilter] = React.useState(cache.filter);
+ const [filterDebounced] = useDebounce(filter, 500);
```

```diff
  const loadCharacters = async () => {
    const characters = await trackPromise(
-      getCharacterCollection(filter),
+      getCharacterCollection(filterDebounced),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };


  React.useEffect(() => {
    loadCharacters();
+  }, [filterDebounced]);
```

Si ahora ejecutamos y vemos el tab de network, veremos que sólo se hace una petición a la api cuando el usuario deja de escribir.

# Refactoring

Ahora llega el momento duro, esto código funciona, pero si te fijas ahora si que empieza a ser complicado de leer... y si lo dejamos así el que llegue pondrá su mierdecita y una detrás de otra y al final ponle nombre a este "mostruito".

Es el momento de ser profesionales y refactorizar, ya conocemos bien el problema, y seguro que hay cosas que nos chirrían, aguantamos el aliento en el cogote de nuestro jefe y nos ponemos manos a la obra:

Vamos a pensar en _vaciar el cangrejo_ aquí hay demasiada lógica en la página de actores y además de cosas que se pueden separar, una aproximación que podríamos utilizar es:

- Extraer la lógica de filtrado a custom hook.
- Extraer la lógica de carga de actores a custom hook.

¿Es esto lo mejor? No tiene porque, y tampoco es directo de ver la solución, igual empezamos a refactorizar y nos damos cuenta de que hay otra solución mejor, lo que si es cierto, que salvo veces que lo tengamos super claro, uno no empieza a entender bien como refactorizar hasta que no tienes la solución medio montada o completa.

Nos vamos a crear un fichero que vamos a llamar _character-collection.hook.tsx_, aquí vamos a almacenar todos los hooks relacionados con esta página (aquí depende, otra opción sería crear una subcarpeta _hooks_ y meter dentro un fichero por cada _hook_ ... _en ocasiones veo Java_ ;), ya hablando en serio, si este ficheor de _hooks_ empieza a hacerse grande mejor romperlo en carpeta y hook por fichero).

Vamos a empezar por el hook de filtrado, una cosa buena de react y los hooks es que te puedes llevar código copiando y pegando al hook:

_./src/pages/character-collection/character-collection/character-collection.hook.tsx_

```tsx
import React from "react";
import { useDebounce } from "use-debounce";
import { useCharacterFilterContext } from "@/core/providers/character-filter/character-filter.context";

export const useFilterHook = () => {
  const cache = useCharacterFilterContext();
  const [filter, setFilter] = React.useState(cache.filter);
  const [filterDebounced] = useDebounce(filter, 500);

  const handleFilterChange = (newValue: string) => {
    setFilter(newValue);
    cache?.setFilter(newValue);
  };

  return { filter, setFilter, filterDebounced, handleFilterChange };
};
```

Hacemos limpia en el fichero y usamos el hook:

_./src/pages/character-collection/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";
import { useCharacterCollectionContext } from "@/core/providers/character-collection";
- import { useDebounce } from "use-debounce";
- import { useCharacterFilterContext } from "@/core/providers/character-filter/character-filter.context";
+ import { useFilterHook } from "./character-collection.hook";
```

```diff
export const CharacterCollectionPage = () => {
  const cache = useCharacterFilterContext();
  const characterCollectionContext = useCharacterCollectionContext();
+ const { filter, filterDebounced, handleFilterChange } = useFilterHook();
-  const [filter, setFilter] = React.useState(cache.filter);
-  const [filterDebounced] = useDebounce(filter, 500);
  const [characters, setCharacters] = React.useState<Character[]>(
    characterCollectionContext.characters
  );

  const loadCharacters = async () => {
    const characters = await trackPromise(
      getCharacterCollection(filterDebounced),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };

-  const handleFilterChange = (newValue: string) => {
-    setFilter(newValue);
-    cache?.setFilter(newValue);
-  };
```

Probamos a ver que todo funciona, ¿Qué tal va quedando el código? Está quedando el jardín más despejado :)

Ahora toca darle caña a la funcionalidad de autores, aquí podemos hacer algo parecido:

- Nos llevamos el uso de contexto de autores a un hook.
- Nos llevamos el estado también.
- Y el loadCharacters podemos hacer lo mismo.
- El useEffect lo podemos dejar en el componente.

_./src/pages/character-collection/character-collection/character-collection.hook.tsx_

```diff
import React from "react";
import { useDebounce } from "use-debounce";
import { useCharacterFilterContext } from "@/core/providers/character-filter/character-filter.context";
+ import { trackPromise } from "react-promise-tracker";
+ import { getCharacterCollection } from "./character-collection.api";
+ import { Character } from "./character-collection.model";
+ import { useCharacterCollectionContext } from "@/core/providers/character-collection";
```

** Añadir al final \***

```tsx
export const useCharacters = () => {
  const characterCollectionContext = useCharacterCollectionContext();
  const [characters, setCharacters] = React.useState<Character[]>(
    characterCollectionContext.characters
  );

  const loadCharacters = async () => {
    const characters = await trackPromise(
      getCharacterCollection(filterDebounced),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };

  return { characters, setCharacters, loadCharacters };
};
```

Aquí tenemos un problema, _filteredDebounce_ no lo tenemos en el hook ¿Qué podemos hacer?

- Lo primero darnos cuenta que no ese debounce no dice nada en este hook, vamos a renombrarlo a filter.
- Por otro lado lo vamos a pasar por parametro en _loadCharacters_.

```diff
-  const loadCharacters = async () => {
+  const loadCharacters = async (filter: string) => {
    const characters = await trackPromise(
-      getCharacterCollection(filterDebounced),
+      getCharacterCollection(filter),
      "non-blocking-area"
    );
    setCharacters(characters);
    characterCollectionContext.setCharacters(characters);
  };
```

Y ahora vamos a refactorizar la página

_./src/pages/character-collection/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { trackPromise } from "react-promise-tracker";
- import { getCharacterCollection } from "./character-collection.api";
- import { Character } from "./character-collection.model";
- import { useCharacterCollectionContext } from "@/core/providers/character-collection";
- import { useFilterHook } from "./character-collection.hook";
+ import { useCharacters, useFilterHook } from "./character-collection.hook";
```

```diff
export const CharacterCollectionPage = () => {
-  const characterCollectionContext = useCharacterCollectionContext();
  const { filter, filterDebounced, handleFilterChange } = useFilterHook();
+ const { characters, setCharacters, loadCharacters } = useCharacters();

-  const [characters, setCharacters] = React.useState<Character[]>(
-    characterCollectionContext.characters
-  );

-  const loadCharacters = async () => {
-    const characters = await trackPromise(
-      getCharacterCollection(filterDebounced),
-      "non-blocking-area"
-    );
-    setCharacters(characters);
-    characterCollectionContext.setCharacters(characters);
-  };

  React.useEffect(() => {
-    loadCharacters();
+    loadCharacters(filterDebounced);
  }, [filterDebounced]);
```

Y ya que estamos vamos a refactorizar el markup, aquí tenemos la página que haría de contenedor ¿Que podríamos plantear? Si nos ponemos canónicos, haríamos lo siguiente:

- Tener la lógica del componente en el contenedor (Que sería la página).
- Crear un componente que haga de presentacional.
- Romper en subcomponentes presentacionales.

Esto no debemos de tomarlo como que es algo que va a "misa", normalmente en un proyecto real suele ser una aproximación que va bien para el 70% de los casos de una aplicación de negocio, pero hay otros que son más sencillos o diferentes y no merece la pena meter tanto ruido, de hecho en este caso de momento lo que vamos a hacer es:

- Crear una carpeta components.
- Crear un componente de filtrado.
- Crear un componente de character-collection.

Vamos a ello:

Primero el filtrado:

_./src/pages/character-collection/components/filter.component.tsx_

```tsx
import React from "react";

interface Props {
  filter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterComponent: React.FC<Props> = (props) => {
  const { filter, onFilterChange } = props;

  return (
    <>
      <label htmlFor="filter">filter</label>
      <input
        id="filter"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </>
  );
};
```

Creamos un barrel:

_./src/pages/character-collection/components/index.ts_

```tsx
export * from "./filter.component";
```

Vamos a refactorizar la página:

_./src/pages/character-collection/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { useFilterHook, useCharacters } from "./character-collection.hook";
+ import { FilterComponent } from "./components";
```

```diff
  return (
    <>
      <h1>Character Collection</h1>
-      <label htmlFor="filter">filter</label>
-      <input
-        id="filter"
-        value={filter}
-        onChange={(e) => handleFilterChange(e.target.value)}
-      ></input>
+     <FilterComponent filter={filter} onFilterChange={handleFilterChange} />
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link to={`/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
```

Vemos que la app sigue funcionando (pequeño detalle sin importancia :)).

Ahora vamos a por el listado de actores:

_./src/pages/character-collection/components/character-collection.component.tsx_

```tsx
import React from "react";
import { Character } from "../character-collection.model";
import { Link } from "react-router-dom";

interface Props {
  characters: Character[];
}

export const CharacterCollectionComponent: React.FC<Props> = (props) => {
  const { characters } = props;

  return (
    <ul>
      {characters.map((character) => (
        <li key={character.id}>
          <Link to={`/${character.id}`}>{character.name}</Link>
        </li>
      ))}
    </ul>
  );
};
```

Lo añadimos al barrel:

_./src/pages/character-collection/components/index.ts_

```tsx
export * from "./filter.component";
+ export * from "./character-collection.component";
```

Y lo usamos en la página:

_./src/pages/character-collection/character-collection/character-collection.page.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
import { useFilterHook, useCharacters } from "./character-collection.hook";
- import { FilterComponent } from "./components";
+ import { FilterComponent, CharacterCollectionComponent } from "./components";
```

```diff
  return (
    <>
      <h1>Character Collection</h1>
      <FilterComponent filter={filter} onFilterChange={handleFilterChange} />
-      <ul>
-        {characters.map((character) => (
-          <li key={character.id}>
-            <Link to={`/${character.id}`}>{character.name}</Link>
-          </li>
-        ))}
-      </ul>
+    <CharacterCollectionComponent characters={characters} />
    </>
  );
```

¿Qué os parece? ¿Cómo se ha quedado? ¿Ha merecido la pena?

Varios consejos:

- Estos refactors hazlos paso paso y ves probando (si lo intentas de un tirón te vas a liar).
- Si además los acompañas de pruebas unitarias (estén ya implementadas de antes o que las vayas a implementar), mejor que mejor.

¿Qué se podría hacer a futuro?

- Plantear, seguramente el componente que muestra un actor sea más elaborado (lo normal es que se un card con la foto y varios datos y/o acciones), aquí podríamos plantear un componente de actor, y por ejemplo que un compañero se encargara de darle el estilado fino.
- Si el contenedor crece en complejidad, crear un componente presentacional para la página de actores.

Le hemos pegado un buen repaso a conceptos básicos de contexto y buenas prácticas, más adelante lo revisitaremos para ver que problemas de rendimiento puede tener.
