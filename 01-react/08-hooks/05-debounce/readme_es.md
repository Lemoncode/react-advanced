# 05 Debounce

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

Pasamos a ver un ejemplo práctico, tenemos un listado de resultado de búsqueda (esto viene de un servidor), y queremos que cada vez que introduzcamos un cambio en un input de filtrado, envíe una petición a servidor para obtener la nueva lista filtrada y mostrarla.

Para evitar llamadas innecesarias, veremos como utilizar Debounce (es decir esperar un poquito a que el usuario termine de teclear para enviar la petición).

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
```

Vamos abrir el fichero _app.tsx_ y vamos añadir una entrada en el estado que almacene el filtro actual de búsqueda, y otra en la que almacene una lista de usuarios.

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
+ const [filter, setFilter] = React.useState("");
+ const [userCollection, setUserCollection] = React.useState([]);

- return <h1>Hello React !!</h1>;
+ return (
+   <div>
+     <input value={filter} onChange={(e) => setFilter(e.target.value)} />
+     <ul>
+       {userCollection.map((user, index) => (
+         <li key={index}>{user.name}</li>
+       ))}
+     </ul>
+   </div>
+ );
};

```

Para usar un servidor real, vamos a utilizar la [Rest API de Rick And Morty](https://rickandmortyapi.com/documentation/#rest) para que nos devuelva el nombre de los personajes.

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
  const [filter, setFilter] = React.useState("");
  const [userCollection, setUserCollection] = React.useState([]);

+ React.useEffect(() => {
+   fetch(`https://rickandmortyapi.com/api/character/?name=${filter}`)
+     .then((response) => response.json())
+     .then((json) => setUserCollection(json.results || []));
+ }, [filter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

```

Esto está bien, pero no es óptimo, ya que cada vez que introducimos una nueva palabra en el input estamos haciendo una llamada a la API. Normalmente queremos disparar la búsqueda justo cuando el usuario ha dejado de teclear para evitar hacer llamadas innecesarias.

Para arreglarlo, podemos crear un custom hook que aplique el filtro solamente cuando el usuario ha parado de teclear 

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
  const [filter, setFilter] = React.useState("");
+ const debouncedFilter =   useDebounce(filter, 500);
  const [userCollection, setUserCollection] = React.useState([]);

  React.useEffect(() => {
-   fetch(`https://rickandmortyapi.com/api/character/?name=${filter}`)
+   fetch(`https://rickandmortyapi.com/api/character/?name=${debouncedFilter}`)
      .then((response) => response.json())
      .then((json) => setUserCollection(json.results || []));
- }, [filter]);
+ }, [debouncedFilter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

+ const useDebounce = (value, timeout: number) => {
+   const [debouncedValue, setDebouncedValue] = React.useState(value);

+   React.useEffect(() => {
+     const timerId = setTimeout(() => {
+       setDebouncedValue(value);
+     }, timeout);
+     return () => {
+       clearTimeout(timerId);
+     };
+   }, [value, timeout]);

+   return debouncedValue;
+ };

```

Con esta implementación, hasta que no pasen _500 milisegundos_ desde que el usuario ha dejado de teclear, no se lanza la petición al servidor.

Como alternativa nos podemos bajar una librería que ya tenga la implementación de este hook como por ejemplo https://github.com/xnimorz/use-debounce:

```bash
npm install use-debounce --save
```

_./src/app.tsx_

```diff
import React from "react";
+ import { useDebounce } from 'use-debounce';

export const App = () => {
  const [filter, setFilter] = React.useState("");
- const debouncedFilter = useDebounce(filter, 500);
+ const [debouncedFilter] = useDebounce(filter, 500);
  const [userCollection, setUserCollection] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${debouncedFilter}`)
      .then((response) => response.json())
      .then((json) => setUserCollection(json.results || []));
  }, [debouncedFilter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

- const useDebounce = (value, timeout: number) => {
-   const [debouncedValue, setDebouncedValue] = React.useState(value);

-   React.useEffect(() => {
-     const timerId = setTimeout(() => {
-       setDebouncedValue(value);
-     }, timeout);
-     return () => {
-       clearTimeout(timerId);
-     };
-   }, [value, timeout]);

-   return debouncedValue;
- };

```

> Ojo que aquí hay que hacer destructuring de array al usar el _useDebounce_
