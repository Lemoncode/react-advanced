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

Vamos a crear una carpeta que llamaremos _modules_.

Creamos una subcarpeta que llamaremos _teams_

```bash
cd src
mkdir modules
cd modules
mkdir teams
```

Dentro de teams arrastramos los pods de _team_ y _team-collection_ y las escenas.

Tenemos una página que es común tanto a todo como a team, la vamos a separar en el módulo de home.

Creamos carpeta:

```bash
cd src
cd modules
mkdir home
```

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

Copiamos la escena de dashboard.

Vamos a crear un conjunto de rutas por cada módulo:

## Modulo Team

_./src/modules/teams/core/routing/router.const.ts_

```ts
export const ROUTES = {
  GITHUB_MEMBER_COLLECTION: "/github-members",
  GITHUB_MEMBER: "/github-member/:id",
};
```

_./src/modules/teams/core/routing/router.router.ts_

```ts
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";

import {
  GithubMemberCollectionScene,
  GithubMemberScene,
} from "@/modules/teams/scenes";

export const Router: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={ROUTES.GITHUB_MEMBER_COLLECTION}
          element={<GithubMemberCollectionScene />}
        />
        <Route path={ROUTES.GITHUB_MEMBER} element={<GithubMemberScene />} />
      </Routes>
    </Router>
  );
};
```

_./src/modules/teams/core/routing/index.ts_

```ts
export * from "./router.const";
export * from "./router.router";
```

Y creamos el punto de entrada:

_./src/modules/teams/index.ts_

```ts
export * from "./core/routing";
```

Si te fijas tenemos un problema, este import, no queda muy bien:

```ts
import {
  GithubMemberCollectionScene,
  GithubMemberScene,
} from "@/modules/teams/scenes";
```

Si lo tuviéramos en un proyecto separado podríamos hacer que ese _@_ estuviera justo apuntado a las carpetas adecuadas, como estamos dentro, tenemos varias opciones:

- Dejarlo como está.
- Usar otro comodín para cada submódulo, por ejemplo _#_, esto sería un rollo en este caso (cada proyecto con su alias)... como curiosidad esta solución se usa en Turbo Repo en proyectos de tipo librería (ver manfredExport).
- Usar un alias más verboso como por ejemplo _@teams_.

Vamos a tirar por la tercera vía:

_./vite.config.ts_

```diff
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  test: vitestConfig.test,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
+   "@home": fileURLToPath(new URL("./src/modules/home", import.meta.url)),
+    "@teams": fileURLToPath(new URL("./src/modules/teams", import.meta.url)),
+   "@tasks": fileURLToPath(new URL("./src/modules/tasks", import.meta.url)),
    },
  },
  css: {
```

Le indicamos a TypeScript que se coma ese alias:

_./typing.d.ts_

```ts
declare module "@home/*";
declare module "@teams/*";
declare module "@tasks/*";
```

Refactorizamos:

_./src/modules/teams/core/routing/router.router.ts_

```diff
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";

import {
  GithubMemberCollectionScene,
  GithubMemberScene,
- } from "@/modules/teams/scenes";
+ } from "@teams/scenes";

export const Router: React.FC = () => {
```

Y vamos a refactorizar los imports de las escena:

_./src/modules/teams/scenes/github-member-collection.scene.tsx_

```diff
import React from "react";
import { Link, useParams } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { ROUTES } from "@teams/core/routing";
- import { GithubMemberPod } from "@/pods";
+ import { GithubCollectionPod } from "@teams/pods";
```

_./src/modules/teams/scenes/github-member-scene.tsx_

```diff
import React from "react";
import { Link, useParams } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { ROUTES } from "@teams/core/routing";
- import { GithubMemberPod } from "@/pods";
+ import { GithubMemberPod } from "@teams/pods";

export const GithubMemberScene: React.FC = () => {
```

Y el componente:

_./src/modules/teams/pods/github-collectionc.component.tsx_

```diff
import React from "react";
import { GithubMemberVm } from "./github-collection.vm";
import classNames from "classnames";
import { Link, generatePath } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { ROUTES } from '@teams/core/routing';
import classes from "./github-collection.component.module.css";
```

> Si un día quisieramos refactorizar a proyecto separado sería relativamente fácil cambiar el alias.

# Home

Vamos a por el módulo de home.

Esté módulo es "el perro verde" ya que comparte rutas con y escenas con otros módulos, aquí podemos seguir varias aproximaciones (no hay bala de plata)

1. Evitar esto, si realmente tienes módulos separados, tienes módulos separados, y en este ruta común si usas componentes de otros módulos, ¿Porqué nos los promocionas a una librería común?

2. Llevarte a común ciertas rutas y pods.

3. Aceptar que el mundo es así, y que vas a tener un "modulo de guarrería"... y que sea lo más pequeño posible, si empieza a creer ¿Realmente sabes cortar en módulos separados? ¿No te hará falta otra aproximación?

Retocamos la escena

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { ROUTES } from "@/core/routing";
+ import { ROUTES as TEAM_ROUTES } from "@teams/core/routing";
- import { GithubCollectionPod } from "@/pods";
+ import { GithubCollectionPod } from "@teams/pods";
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
+     <Link to={teamsRoutes.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
    </div>
  );
};

```

Vamos a por los pods y escenas de dashboard.

_./src/modules/home/core/routing/router.const.ts_

```ts
export const ROUTES = {
  DASHBOARD: "/",
};
```

Y ahora el _router_

_./src/modules/home/core/routing/router.tsx_

```ts
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";
import { DashboardScene } from "@home/scenes";

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.DASHBOARD}
        element={<GithubMemberCollectionScene />}
      />
    </Routes>
  );
};
```

Creamos un barrel:

_./src/modules/home/core/routing/index.ts_

```ts
export * from "./router";
export * from "./routes.const.ts";
```

Y añadimos el barrel en el módulo:

_./src/modules/home/index.ts_

```ts
export * from "./core/routing";
```

## Shell

Vamos ahora a juntar todo esto en la aplicación principal.

Primero las rutas.

Cambiamos el de constantes

_./src/core/routing/router.const.ts_

```ts
export const MODULES = {
  HOME_MODULE: "",
  TEAMS_MODULE: "/teams",
  TASKS_MODULE: "/tasks",
};
```

Y vamos a actualizar las rutas:

_./src/core/routing/router.ts_

```diff
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
- import { ROUTES } from "./routes.const";
+ import { MODULES } from "./routes.const";
+ import { HomeRouter } from "@home/";
+ import { TeamsRouter } from "@teams/";

import { GithubMemberCollectionScene, GithubMemberScene } from "@teams/scenes";

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
-        <Route
-          path={ROUTES.GITHUB_MEMBER_COLLECTION}
-          element={<GithubMemberCollectionScene />}
-        />
-        <Route path={ROUTES.GITHUB_MEMBER} element={<GithubMemberScene />} />
+        <Route
+          path={`${MODULES.HOME_MODULE}/*`}
+          element={<HomeRouter />}
+        />
+        <Route
+          path={`${MODULES.TEAMS_MODULE}/*`}
+          element={<TeamsRouter />}
+        />
      </Routes>
    </HashRouter>
  );
};
```

Vamos a ver que tal funciona la aplicación.

```bash
npm run dev
```
