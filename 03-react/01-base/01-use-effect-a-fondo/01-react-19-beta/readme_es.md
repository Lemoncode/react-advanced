# Introducción

Ya hemos visto que esto del _useEffect_ y los corchetes es ahora una práctica mala, en React 19 te dan ahora una alternativa, vamos a ver como funciona.

# Pasos

Vamos a actualizar las dependencias de react y react dom para tirar con esta Beta (puede que ya este en RC o Release)

```bash
npm install react@beta react-dom@beta
```

Y para actualizar los tipos, ahora que estamos en beta tenemos que hacer algún truco de magía

_./package.json_

```diff
  "dependencies": {
    "react": "^19.0.0-beta-26f2496093-20240514",
    "react-dom": "^19.0.0-beta-26f2496093-20240514",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
-    "@types/node": "^20.12.12",
-    "@types/react": "^18.2.66",
+    "@types/react": "npm:types-react@beta",
+    "@types/react-dom": "npm:types-react-dom@beta",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  },
+   "overrides": {
+    "@types/react": "npm:types-react@beta",
+    "@types/react-dom": "npm:types-react-dom@beta"
+  }

```

> Más info: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#typescript-changes

Más adelante cuando esté publicado podremos usar:

```bash
npm install @types/react@beta @types/react-dom@beta
```

con React Router DOM nos puede dar un error si intentamos instalar:

```bash
npm install react-router-dom@latest
```

```
npm ERR! Could not resolve dependency:
npm ERR! peer react@">=16.8" from react-router-dom@6.23.1
```

Vamos a ahcer un force

```bash
npm install react-router-dom@latest --force
```

> Por cosas como estás hay que tener cuidado cuando juguemos con versiones Beta, están bien para jugar pero no para hacer una migración de un proyecto real hasta que no estén en release y con el ecosistema de librerías compatible.

Bueno después de este lío para instalar la beta, vamos al turrón, tenemos este código que ahora se considera "demoniaco"

```diff
export const CharacterCollectionPage = () => {
  const [filter, setFilter] = React.useState("");
  const [characters, setCharacters] = React.useState<Character[]>([]);

  React.useEffect(() => {
    getCharacterCollection().then((characters) => setCharacters(characters));
  }, []);

  return (
```

Pasamos al nuevo hook _use_ (ojo cambiamos el fichero completo), ojo igual tenemos algunos problemas de typings tiramos para adelante porque es una beta

```ts
import { Suspense, use } from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";

export const CharacterCollectionPage = () => {
  const characterPromise = getCharacterCollection();

  return (
    <>
      <h1>Character Collection</h1>
      <Link to="/1">Character 1</Link>
      <Suspense fallback={<div>Cargando datos...</div>}>
        <CharacterCollectionInnerPage charactersPromise={characterPromise} />
      </Suspense>
    </>
  );
};

interface Props {
  charactersPromise: Promise<Character[]>;
}

export const CharacterCollectionInnerPage = ({ charactersPromise }: Props) => {
  const characters = use<Promise<Character[]>>(charactersPromise);

  return (
    <ul>
      {characters.map((character: any) => (
        <li key={character.id}>
          <Link to={`/${character.id}`}>{character.name}</Link>
        </li>
      ))}
    </ul>
  );
};
```

¿Cómo va esto? 

- Llamamos a API que devuelve promesa en componente padre. 

- Envolvemos con suspense en componente hijo, de esta forma hasta que no se resuelvan los _use_ en los componentes hijos no los renderiza.

 - El componente hijo hace un _use_ de la promesa, cuando se resuelva ya ejecuta el código. 
 
 - Mientras la promesa no se resuelva, suspense deja el componente hijo a la espera.

¿Y si sale algo mal? Podemos usar un Error Boundary, para mantenerlo todo sencillo vamos a dejarlo todo en el mismo fichero:

```diff
import { Character } from "./character-collection.model";

+ class ErrorBoundary extends React.Component {
+  state = { hasError: false, error: null };
+
+  static getDerivedStateFromError(error: any) {
+    return { hasError: true, error };
+  }
+
+  render() {
+    if (this.state.hasError) {
+      return <h2>Algo salió mal, reintenta de nuevo</h2>;
+    }
+
+    return this.props.children;
+  }
+ }
```

Y ahora vamos a envolver el _CharacterCollectionPage_

```diff
export const CharacterCollectionPage = () => {
  const characterPromise = getCharacterCollection();

  return (
    <>
      <h1>Character Collection</h1>
      <Link to="/1">Character 1</Link>
+     <ErrorBoundary>
        <Suspense fallback={<div>Cargando datos...</div>}>
            <CharacterCollectionInnerPage charactersPromise={characterPromise} />
        </Suspense>
+     </ErrorBoundary>
    </>
  );
};
```

Vamos ahora a lanzar un castañazo, cambiamos la API:

_./character-collection.api.ts_

```diff
import { Character } from "./character-collection.model";

export const getCharacterCollection = async (): Promise<Character[]> => {
-  const response = await fetch("https://rickandmortyapi.com/api/character");
+  const response = await fetch("https://locahost:3434/crash");
  const data = await response.json();
  console.log(data.results);
  return data.results;
};
```

¿Qué te parece? ¿Un poco lioso?

En el siguiente ejemplo vamos a ver como resuelve esto React Query que es una librería muy potente que se puede usar también en React 18.


