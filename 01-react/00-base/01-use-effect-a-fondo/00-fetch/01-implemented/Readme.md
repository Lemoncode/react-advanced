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

```

¿Qué podemos hacer para traernos datos?

- Usar una solucíon de tipo Framework, NextJs y Remix, en el caso de NextJs
  tenemos una opción que es _getInitialProps_ que se ejecuta en servidor.

- Utilizar una librería para gestionar consultas como _react-query_

Para este caso vamos a estudiar _react-query_

---

la API loca... con el interval.
