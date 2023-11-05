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

\*\*\* Este código mejorar con el promise

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

## UseDebounce

Tirar esto sin filtrado no tiene mucha merito, vamos poner el filtrado en funcionamiento de nuevo.

Esto lo ponemos como ejercicio (tenéis el resultado anterior para ir copiando e integrando):

- Paso 1 habilitar el filtrado.
- Paso 2 añadir el filtro al contexto.

> ¿Qué creéis que es mejor? ¿ Tener un contexto para el filtro y otro para el listado, o un contexto para ambas propiedades?

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
  const characterCollectionContext = useCharacterCollectionContext();
  const [filter, setFilter] = React.useState("");
+ const [filterDebounced] = useDebounce(filter, 500);
```

```diff
  React.useEffect(() => {
-   getCharacterCollection(filter).then((characters) => {
+   getCharacterCollection(filterDebounced).then((characters) => {
     setCharacters(characters);
     characterCollectionContext.setCharacters(characters);
   });
-  }, [filter]);
+  }, [filterDebounced]);
```

Si ahora ejecutamos y vemos el tab de network, veremos que sólo se hace una petición a la api cuando el usuario deja de escribir.
