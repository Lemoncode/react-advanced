# Hola React Query

Vamos a iniciarnos con React Query y que mejor manera que migrar el ejemplo anterior a React Query, vamos a ver que nos aporta.

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos la dependencias.

```bash
npm install
```

## Paso a paso

## Instalación y fontanería

Instalamos React Query y sus devtools

```bash
npm install @tanstack/react-query --save
```

```bash
npm install @tanstack/react-query-devtools --save-dev
```

¿Todos instalado? Perfecto

A nivel de aplicación en tenemos que definir un provider, pero antes nos hace falta instancia una instancia de QueryClient que será la que se usara en toda la aplicación:

./src/core/react-query/query.ts

```tsx
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

Si queremos podemos definir una serie de opciones globales que aplicarían a todas las consultas:

_./src/core/query/query-client_

```diff
import { QueryClient } from "@tanstack/react-query";

- export const queryClient = new QueryClient();
+ export const queryClient = new QueryClient({
+   defaultOptions: {
+     queries: {
+       refetchOnWindowFocus: true,
+       refetchOnMount: true,
+       retry: 0,
+       staleTime: 1000 * 60 * 5,
+       gcTime: 1000 * 60 * 5,
+             refetchInterval: 1000 * 60 * 5,
+     },
+   },
+ });
```

¿Que quieren decir estos valores?

- refetchOnWindowFocus: Esto es para que no se refresque la página cuando se cambia de pestaña.

- refetchOnMount: Esto es para que se refresque la página cuando se carga.

- retry: Esto es para que no se reintenten las peticiones.

- staleTime: Aquí te dicen si los datos están obsoletos:

  - Si no están obsoletos los sirve tal cual y no hace la petición.
  - Si los datos están obsoletos:
    - En caso de que estén en cache te los muestra de primeras.
    - En paralelo te hace un petición a servidor para actualizar los datos.

- gcTime: Es el tiempo en el que mantiene los datos en caché, en cuanto caduca los deja listo para que el recolector de basura se pase a hacer limpia (esto se llamaba antes _cacheTime_).

- interval: Esto es para que cada 5 minutos se refresque la información.

Y lo más interesante, el grado de granularidad que tenemos, además de poder tocar estos settings a nivel global, nos podemos bajar a nivel de consulta y definirlo para una en concreto.

Siguiente paso, a nivel de aplicación vamos a definir un provider para poder usar react-query:

_./src/app.tsx_

```diff
import "./App.css";
import { Router } from "@/core/routing";
+ import { QueryClientProvider } from "@tanstack/react-query";
+ import { queryClient } from "@/core/react-query";

export const App = () => {
  return (
    <>
+    <QueryClientProvider client={queryClient}>
       <Router />
+    </QueryClientProvider>
    </>
  );
};
```

Y ahora vamos a habilitar las devtools de react-query:

```diff
+ import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// (...)

export const App = () => {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Router />
+      <ReactQueryDevtools/>
    </QueryClientProvider>
    </>
  );
};
```

Esto nos permitirá ir viendo el estado de las diferentes queries que estemos trackeando con react-query, en producción directamente no sale.

## Lista de miembros de Github

Vamos ahora a tirar nuestra primera consulta con `React Query``, fíjate que nos cargamos el _useEffect_ que teníamos antes:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
- import { GithubMemberVm } from "./github-collection.vm";
import { GithubCollectionComponent } from "./github-collection.component";
+ import { useQuery } from "@tanstack/react-query";

export const GithubCollectionPod: React.FC = () => {
-  const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm[]>(
-    []
-  );

-  React.useEffect(() => {
-    const loadGithubMembers = async () => {
-      const members = await getGithubMembersCollection("lemoncode");
-      setGithubMembers(members);
-    };
-
-    loadGithubMembers();
-  }, []);


+  const { data: githubMembers = [] } = useQuery({
+    queryKey: ["githubMembers", "lemoncode"],
+    queryFn: () => getGithubMembersCollection("lemoncode"),
+  });

  return (
```

Probamos y vemos que funciona:

```bash
npm run dev
```

Y vamos a jugar un poco con las devtools y los eventos (le damos la icono de la isla de abajo a la derecha).

Y de paso abrimos el tab de network, a ver si cabe todo.

### Ejercicio

Con lo poco que sabemos ya somos capaces de hacer algo interesantes, vamos a permitir al usuario teclear el nombre de una organizacíon y vemos las fotos de los miembros de la misma, como estos datos van a cambiar muy poco jugaremos con _stale_ y _gcTime_ para esta consulta también.

Punto de partida:

```diff
  return (
+   <>
+     <div>
+       <input type="text" />
+       <button>Buscar</button>
+     </div>
    <div className={classNames(classes.container, classes.someAdditionalClass)}>
      <span className={classes.header}>Avatar</span>
      <span className={classes.header}>Id</span>
      <span className={classes.header}>Name</span>
      {githubMembers.map((member) => (
        <>
          <img src={member.avatarUrl} />
          <span>{member.id}</span>
          <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: member.name })}>
            {member.name}
          </Link>
        </>
      ))}
    </div>
+  </>
  );
};
```

> Nota, esto huele a componentizar... :) pero lo dejamos para más adelante (cada fila a un componente, y el componente de filtrado a otro).

Pistas:

- El filtro lo podemos guardar en el estado, por defecto puede ser lemoncode.
- Metemos un botón para realizar el filtro.
- En la consulta de React Query en vez de hardcodear Lemoncode usamos como segundo filtro de la caché el valor del filtro.
- Lo mismo en la llamada a la api.

Desafió:

- ¿Y si partimos de filtro en blanco? No queremos lanzar la consulta hasta que el usuario pulse el botón.

### Aristas

Vamos a cubrir algunas aristas (después avanzaremos e iremos a por más)

¿Qué pasa si me hace falta ejecutar alguna acción justo cuando se han cargado los datos? Para eso tengo el evento _onSuccess_:

Y si... También tengo _onError_ para gestionar errores

Y si... ¿Quiero que la consulta deje de refrescarse de forma automática? Puede jugar con el _enabled_ y ponerlo a false bajo alguna condición.

¿Y al contrario? Quiero que el usuario pueda hacer un refresh manual, para eso tengo el _refetch_.

Oye y... ¿Ese string harcodeado no es peligroso? ¿Y si tengo parámetros en la búsqueda? ¿ Cómo lo cachea?

Otro tema muy interesante, la diferencia entre _stale_ y _cache_, st
ale es te muestro datos pero aún así hago la carga en background, y cache es tiro de estos datos sin hacer la consulta en background, esto puede ser muy útil cuando los datos cambian poco o son sólo lectura, un ejemplo en tiempo real:

Una aplicación basada en mapas, conforme vas haciendo zoom in o out se lanzan consultas para informa de cada spot en detalle o si es un zoom out datos globalizados (también puedes moverte en el mapa), usando React Query la mejora en rendimiento es bruta, en cuanto se calienta con los zoom va todo superfluido.

## Detalle

## Diferencia

## Mejora estructura keys

Manual

Librería

Dev tool

¿Listo para el siguiente paso? Edición...

# Ejericicio busqueda organizacíon y key

# Para saber más

https://tkdodo.eu/blog/practical-react-query
