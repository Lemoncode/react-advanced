# Context- Filter

Vamos a meternos ahora con el contexto de React.

En estos ejemplos nos vamos a centrar en entender bien como usarlo y que buenas prácticas podemos aplicar, más adelante revisitaremos el contexto para hablar sobre rendimiento.

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

Si navegamos de listado de personajes a detalle y volvemos al listado, vemos que el filtro se resetea, ¡ Vaya rollo !

¿Qué podemos hacer para que el filtro se mantenga? Utilizar el contexto y almacenar el filtro ahí.

Para ello vamos a crear un contexto y un provider para ¿Donde lo colocamos? Aquí depende el nivel al que lo necesitemos, en nuestro caso:

- Es un valor de filtro que está en una página.
- Queremos que persista entre navegaciones.
- Lo tenemos que colocar por encima del router.

Por otro lado ¿En que carpeta lo colocamos?

- Podríamos pensar en crearlo a nivel de la carpeta de página o escena:
  - Argumento a favor: Es un valor que solo se usa en esa página.
  - Argumento en contra: Lo vamos a instanciar a nivel de página (nos salimos de la escena).
- Podríamos crear como carpeta transversal (core):
  - Argumentos a favor:
    - Se instancia a nivel de aplicación.
    - Es algo transversal a la aplicación.
  - Argumentos en contra:
    - En este caso el filtro sólo se va a usar en este página.

Vamos a tomar la aproximación de crearlo debajo de la carpeta _core_ como sabemos que tendremos más contexto, vamos a crear dentro de esta una subcarpeta _providers_

Ahora toca plantear como crear el contexto, para que sea más mantenible, vamos a crear varios ficheros:

- characters-filter-context.ts: Contendrá el contexto.
- characters-filter-provider.ts: Contendrá el provider y un helper para instanciarlo.
- index.ts: el barrel de la carpeta.

Vamos a crear el contexto, para ello vamos a usar la función createContext de React:

_./src/core/providers/character-filter/character-filter.context.ts_

```tsx
import { Context, createContext, useContext } from "react";

interface ContextProps {
  filter: string;
  setFilter: (filter: string) => void;
}

// asignamos un objeto por si el filtro crece en un futuro
export const CharacterFilterContext = createContext<ContextProps | null>(null);

export const useCharacterFilterContext = (): ContextProps => {
  const context = useContext(CharacterFilterContext);
  if (!context) {
    throw new Error(
      "useCharacterFilterContext must be used within a CharacterFilterProvider"
    );
  }
  return context;
};
```

Vamos ahora a definir un proveedor para el contexto, para ello vamos a crear un componente que reciba como prop el children y que renderice el provider:

_./src/core/providers/character-filter.provider.tsx_

```tsx
import React from "react";
import { CharacterFilterContext } from "./character-filter.context";

export const CharacterFilterProvider: React.FC = ({ children }) => {
  const [filter, setFilter] = React.useState("");
  return (
    <CharacterFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </CharacterFilterContext.Provider>
  );
};
```

Vamos ahora a crear el barrel:

```tsx
export * from "./character-filter.context";
export * from "./character-filter.provider";
```

Vamos a darle uso a ese contexto en la página de listado de actores:

_./src/pages/character-collection/character-collection.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { useQuery } from "@tanstack/react-query";
import { Character } from "./character-collection.model";
+ import { useCharacterFilterContext } from "@/core/providers";

export const CharacterCollectionPage = () => {
+ const cache = useCharacterFilterContext();
-  const [filter, setFilter] = React.useState("");
+  const [filter, setFilter] = React.useState(cache.filter);

+ const handleFilterChange = (filter: string) => {
+   setFilter(filter);
+   cache.setFilter(filter);
+ };

  const query = useQuery({
    queryKey: ["character-collection", filter],
    queryFn: () => getCharacterCollection(filter),
  });

  return (
    <>
      <h1>Character Collection</h1>
      <label htmlFor="filter">filter</label>
      <input
        id="filter"
        value={filter}
-        onChange={(e) => setFilter(e.target.value)}
+       onChange={(e) => handleFilterChange(e.target.value)}
      />
      <ul>
```

Si intentamos ejecutar la aplicación, vemos que nos da un error:

```bash
Error: useCharacterFilterContext must be used within a CharacterFilterProvider
```

¿Esto a que se debe? A que se nos ha olvidado instanciar el provider, es la ventaja de haber creado ese pequeño método de ayuda para traernos el contexto.

_./src/App.tsx_

```diff
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./core/queries";
+ import { CharacterFilterProvider } from "@/core/providers/character-filter";

export const App = () => {
  return (
+ <CharacterFilterProvider>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
+ </CharacterFilterProvider>
  );
};
```

Ahora sí, ejecutamos la aplicación y veremos que funciona correctamente, podemos ir a la página de detalle y cuando volvemos el filtro se mantiene.
