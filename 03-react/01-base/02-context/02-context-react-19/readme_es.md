# Context- React 19

En React 19 han introducido mejoras para que podamos trabajar con contextos de una forma más sencilla y eficiente.

Vamos a migrar el ejemplo anterior a React 19

# Manos a la obra

Partimos del ejemplo anterior, si no tenemos instaladas las dependencias, vamos a instalarlas:

```bash
npm install
```

Ejecutamos y todo fantástico:

```bash
npm run dev
```

Vemos que todo funciona, ok.

Repetimos los mismos pasos que en el otro ejemplo que migramos a 19 Beta

Vamos a parar el server y vamos a instalar la versión 19 de React (ojo aquí esta como Beta, en cuando este en Release no hará falta liar tanto pollo):

Vamos a actualizar las dependencias de react y react dom para tirar con esta Beta (puede que ya este en RC o Release)

```bash
npm install react@beta react-dom@beta --force
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
-    "@types/react": "^18.2.66",
-    "@types/react-dom": "^18.2.66",
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

Vamos a hacer otro _npm install force_

```bash
npm install --force
```

y volemos a ejecutar para ver que no hemos roto nada:

```bash
npm run dev
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

Bueno después de este lío para instalar la beta, vamos al turrón.

¿Qué trae de nuevo React 19 para el contexto? Pues que nos quitamos el tener que poner _context.Provider_, vamos a verlo:

_./src/core/providers/character-filter/character-filter.provider.tsx_

```diff
export const CharacterFilterProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = React.useState("");
  return (
-    <CharacterFilterContext.Provider value={{ filter, setFilter }}>
+    <CharacterFilterContext value={{ filter, setFilter }}>
      {children}            
-    </CharacterFilterContext.Provider>
+    </CharacterFilterContext>
  );
};
```

Salen errores pero es por problemas con los typings de la beta, si ejecutamos vemos que funciona.

Bueno un poco de azúcar sintáctico, pero OJO en proximas version si usas _context.Provider_ te va a dar un warning.

