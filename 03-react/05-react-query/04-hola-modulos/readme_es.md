# Hola Módulos

Toca implementar una funcionalidad totálmente distinta a la de gestión de "equipo" (miembros de github), gestión de tareas, aquí mi consejo sería crea una aplicación separada y compartir el token JWT de seguridad, así tenemos liberta en el futuro de reescribirla en otra tecnología si fuera necesario (y que no impacta a la otra aplicación, la teoría del monolito... yo es que fui a por tabaco y mira donde he terminado).

Nos ponemos en el escenario de que eso no es posible y ambas aplicaciones tienen que compartir datos / sesión... vamos a ver como al menos organizarloo y trocearlo de primeras en módulos.

Esto sería un paso previo a dividirlas en Micro Front Ends separados (eso es otra cosa el termino Micro Front End da para muchas definiciones, al final de este ejemplo comentamos).

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos la dependencias.

```bash
npm install
```

## Estructura

Nuestro objetivo es tener una estructura como esta:

```
modules
├── home
  ├── core
  ├── scenes
  ├── pods
├── tasks
  ├── core
  ├── scenes
  ├── pods
├── teams
  ├── core
  ├── scenes
  ├── pods
```

La idea es que:

- El módulo principal cargue todas las dependencias.
- El de _home_ va a ser cajón desastre, va a tirar de rutas de otros módulos, incluso de pods (esto se podría resolver de otras maneras).
- Los de _teams_ y _tasks_ van a ser estancos (debería de ser lo normal).

Vamos a definir nuevos alias:

_./vite.config.js_

```diff
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  test: vitestConfig.test,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
+      "@home": fileURLToPath(new URL("./src/modules/home", import.meta.url)),
+      "@teams": fileURLToPath(new URL("./src/modules/teams", import.meta.url)),
+      "@tasks": fileURLToPath(new URL("./src/modules/tasks", import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
```

_./tsconfig.json_

```diff
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
+      "@home/*": ["./modules/home/*"],
+      "@teams/*": ["./modules/teams/*"],
+      "@tasks/*": ["./modules/tasks/*"]
    },
```

Arrancamos por migrar la carpeta de _teams_:

Vamos a crearnos un listado de rutas:

_./src/modules/teams/core/routing/teams-routes.const.ts_

```ts
const baseTeamsModuleRoutes = "/teams";

const genPath = (path: string) => `${baseTeamsModuleRoutes}${path}`;

export const MODULE_TEAMS_ROUTES = {
  GITHUB_MEMBER_COLLECTION: genPath("/github-members"),
  GITHUB_MEMBER: genPath("/github-member/:id"),
};
```

## Teams

Vamos a exponer las rutas de una manera que la pueda consumir el módulo principal:

_./src/modules/teams/core/routing/teams.router.tsx_

```ts
import { MODULE_TEAMS_ROUTES } from "./teams-routes.const";

// TODO: esto va a fallar porque no tenemos las escenas migradas
import { GithubMemberCollectionScene, GithubMemberScene } from "@teams/scenes";

export const moduleTeamsRoutes = [
  {
    path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION,
    element: <GithubMemberCollectionScene />,
  },
  { path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER, element: <GithubMemberScene /> },
];
```

Creamos un barrel:

_./src/modules/teams/core/routing/index.ts_

```ts
export * from "./teams-routes.const";
export * from "./teams.router";
```

### Pod github collection

Vamos ahora a copiar los pods (tendremos que hacer cambios).

Creamos carpeta de _pods_ debajo del modulo y copiamos los pods de teams, vamos a modificarlos.

_./src/modules/teams/pods/github-collection.component.tsx_

```diff
import React from "react";
import { GithubMemberVm } from "./github-collection.vm";
import classNames from "classnames";
import { Link, generatePath } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { MODULE_TEAMS_ROUTES } from "@teams/core/routing";
import classes from "./github-collection.component.module.css";

interface Props {
  githubMembers: GithubMemberVm[];
}

export const GithubCollectionComponent: React.FC<Props> = (props) => {
  const { githubMembers } = props;

  return (
    <div className={classNames(classes.container, classes.someAdditionalClass)}>
      <span className={classes.header}>Avatar</span>
      <span className={classes.header}>Id</span>
      <span className={classes.header}>Name</span>
      {githubMembers.map((member) => (
        <React.Fragment key={member.id}>
          <img src={member.avatarUrl} />
          <span>{member.id}</span>
          <Link
-          to={generatePath(ROUTES.GITHUB_MEMBER, { id: member.name })}>
+         to={generatePath(MODULE_TEAMS_ROUTES.GITHUB_MEMBER, {
+              id: member.name,
+            })}
          >
            {member.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};
```

> Fíjate que aquí el principal escollo es el enrutado, nos podríamos plantear implementar un wrapper global de rutas, o del componente Link (o podríamos usar un enrutador agnóstico de framework).

### Scenes

Copiamos las escenas de teams.

### github-member-collection.scene.tsx

Vamos a quitar código de prueba que se había quedado

_./src/modules/teams/scenes/github-member-collection.scene.tsx_

```diff
import React from "react";
- import { Link, generatePath } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
import { GithubCollectionPod } from "@/pods";

export const GithubMemberCollectionScene: React.FC = () => {

  return (
    <div>
      <h1>Github Member Collection</h1>
      <GithubCollectionPod />
-      <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: "23" })}>
-        Go to member
-      </Link>
        Go to member
      </Link>
    </div>
  );
};
```

_./src/modules/teams/scenes/github-member.scene.tsx_

```diff
import React from "react";
import { Link, useParams } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { MODULE_TEAMS_ROUTES } from "@teams/core/routing";
import { GithubMemberPod } from "@/pods";

export const GithubMemberScene: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <GithubMemberPod id={id ?? ""} />
-      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>
+       <Link to={MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION}>
        Back to member collection
      </Link>
    </div>
  );
};
```

Y creamos un barrel:

_./src/modules/teams/scenes/index.ts_

```ts
export * from "./github-member-collection.scene";
export * from "./github-member.scene";
```

### Conectando...

Vamos a crear unos barrels en cada módulo para que el módulo principal pueda tirar de ellos.

_./src/modules/teams/index.ts_

```ts
export * from "./core/routing";

// Esta guarrería hay que hacerla para el módulo de dashboard
export * from "./pods/github-collection";
```

### React Query provider

Vamos a mover nuestro React Query a la carpeta de core en Teams.

Movemos la carpeta:

_./src/core/react-query_

a

_./src/modules/teams/core/react-query_

### RootProvider

Vamos a crear un rootProvider que instanciaremos como layout en el router principal.

_./src/modules/teams/root-provider/index.tsx_

```ts
import React from "react";
import { queryClient } from "@teams/core/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export const ModuleTeamRootProviders: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

Y añadimos al index.ts del modulo:

_./src/modules/teams/index.ts_

```diff
export * from "./core/routing";

// Esta guarrería hay que hacerla para el módulo de dashboard
export * from "./pods/github-collection";

+ export * from './root-provider';
```

## Home

El módulo de home va a ser más sucio porque va a tirar de rutas y pods de otros módulos, aquí podemos plantear:

- Que esto va a ocurrir en contadas ocasiones y vivir con esta dependencia.
- Sacar un módulo común.
- Pensar si realmente estamos haciendo un corte modular correcto.

Creamos la carpeta de _home_ debajo de modules.

### Core

Vamos a crear las constantes de rutas:

_./src/modules/home/core/routing/home-routes.const.ts_

```ts
const baseHomeModuleRoutes = "";

const genPath = (path: string) => `${baseHomeModuleRoutes}${path}`;

export const MODULE_HOME_ROUTES = {
  DASHBOARD: genPath("/"),
};
```

_./src/modules/home/core/routing/home.router.tsx_

```ts
import { MODULE_HOME_ROUTES } from "./home-routes.const";

// TODO: Va a petar por ahora porque no hemos migrado las scenes todavía
import { DashboardScene } from "@home/scenes";

export const moduleHomeRoutes = [
  {
    path: MODULE_HOME_ROUTES.DASHBOARD,
    element: <DashboardScene />,
  },
];
```

Creamos Barrel:

_./src/modules/home/core/routing/index.ts_

```ts
export * from "./home-routes.const";
export * from "./home.router";
```

### Scenes

Es hora de actualizar la escena de dashboard:

** MOVEMOS CONTENIDO DE PRINCIPAL A MODULO HOME SCENE **
** CSS y Scene **

_./src/modules/home/scenes/dashboard.scene.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
- import { GithubCollectionPod } from "@/pods";
+ import { MODULE_TEAMS_ROUTES } from "@teams/index";
+ import { GithubCollectionPod } from "@teams/index";
import classes from "./dashboard.scene.module.css";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className={classes.container}>
        <GithubCollectionPod />
        <div>
          <h1>Place holder for tasks</h1>
        </div>
      </div>
-      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
+      <Link to={MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION}>
+        Go to member collection
+      </Link>
    </div>
  );
};
```

Creamos un barrel:

_./src/modules/home/scenes/index.ts_

```ts
export * from "./dashboard.scene";
```

### Conectando...

Vamos a crear unos barrel para para el módulo de home:

_./src/modules/home/index.ts_

```ts
export * from "./core/routing";
```

## App principal

Eliminamos el routing que teníamos antes

_./src/core/router.tsx_
_./src/core/router.const.ts_
_./src/core/index.ts_

Vamos ahora a configurar el router principal:

_./src/core/routing/main-app-router.tsx_

```tsx
import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { moduleHomeRoutes } from "@home/core/routing";
import { moduleTeamsRoutes, ModuleTeamRootProviders } from "@teams/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const MainAppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ModuleTeamRootProviders>
              <Outlet />
              <ReactQueryDevtools />
            </ModuleTeamRootProviders>
          }
        >
          {/* Ojo a la ñapa aquí */}
          {moduleHomeRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {moduleTeamsRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

Creamos un barrel:

_./src/core/routing/index.ts_

```ts
export * from "./main-app-router";
```

Y vamos a configurar el App:

_./src/app.tsx_

```diff
import "./App.css";

- import { Router } from "@/core/routing";

+ import { MainAppRouter } from "@/core/routing";

- import { QueryClientProvider } from "@tanstack/react-query";
- import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
- import { queryClient } from "@/core/react-query";

function App() {
return (
<>

-      <QueryClientProvider client={queryClient}>
        <Router />

+       <MainAppRouter />

-        <ReactQueryDevtools />
-      </QueryClientProvider>
      </>
  );
  }

export default App;

```

Aprovechamos para borrar las carpetas `pods` y `scenes` que colgaban directamente de `src`, ojo que igual nos da algún problema algún import que nos hayamos dejado colgando.

Y lo levantamos

# Que le queda a esto

Idealmente podríamos dividir esto entre varios proyectos (librería externa o interna), pero seguimos teniendo un gran problema:

- Estamos acoplados a una versión de React concreta.
- Estamos acoplados a una versión de React Router concreta.

Lo ideal sería que: cada módulo pudiera estar escrito con la tecnología que quisiéramos.

Esto nos permite poder ir actualizando módulos de manera independiente, y no atar una aplicación a una tecnología y versión.

Aquí nos meteríamos en un buen jardín:

- Por un lado manejo de rutas:

  - Podemos optar por que cada aplicación maneje su subconjunto de rutas (esto asumiendo que cada router va a respetar al otro).

  - Podemos optar por utilizar una router orientado a Micro Front Ends como [Single SPA](https://github.com/single-spa/single-spa)

- Por otro manejo de estado común y otros eventos:

  - Aquí podemos implementar un shell en javascript plano.

  - Podemos construir adaptadores para cada lenguaje.

- Evitar conflictos de estilado:

  - Está la opción clásica de meterlo todo en iframes :).

  - No podemos utilizar estilos globales, o acordar para todos los MFE un reset CSS concreto.

  - Se podrían optar por wrapear en webcomponents, aún así diversión con los CSS :)).

  - Ojo con las librerías de componentes que a veces traen sorpresas.

- Una que se te puede liar buena es versionado:

  - Se supone que cada MFE va encapsulado, pero me he encontrado (2019) con una versión de React que rompía :-@
  - Ojo a las librerías que uses.

- Otro tema importante es cargar los módulos cuando se vayan a usar:
  - Aquí hay aproximaciones como Webpack Module Federation, pero ya te estás "casando" con Webpack.

Cómo recomendación:

- No os metáis en Micro Front ends si no os hace falta.

- Es algo complejo.

- Piensa si no se podría resolver con una librería.

- En una aplicación que no tengan que compartir datos entre módulos (sólo el token de seguridad), crear aplicaciones totalmente separadas (con librerías comunes).

- Si tienes una aplicación que va a ser enorme y van a compartir datos entre módulos... es necesario que te vayas a este enfoque de Micro Frotn Ends... enhorabuena te vas a comer un marró considerable.

Por otro lado hay muchas formas de enfocar MicroFrontEnds:

- El que más me gusta es el de trocear un monolito en módulos, este me parece muy práctico, ya que te permite ir migrando submodulos de forma gradual.

- Otro es el de sustituir páginas con componentes ricos (como estáis haciendo en Caché).

- Otro que he visto es crear Microfront ends independientes que se combinan y uno puede tirar de otro (un señor lio)
