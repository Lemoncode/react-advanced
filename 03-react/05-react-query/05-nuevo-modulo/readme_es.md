# Nuevo Módulo

Ya hemos establecido una forma de trabajar, vamos a crear un nuevo módulo, sería el de gestión de tareas.

> Esto es un ejemplo simple, no vamos a crear un módulo para dos ventanas, simulamos que es un módulo tipo Jira y que necesita comunicación con el módulo de gestión de equipos (si no hace falta, mejor que sean proyectos separados), ejemnplo basado en un caso real:

- Software de gestión hospitalaría.
- Son 15 módulos que originalmente estaban compilados en un monolito.
- Desde el módulo de urgencias, el usuario podía acceder a pruebas diágnosticas, de allí a ingresos y volver atrás / adelante, manteniendo estado.
- Los objetivos son:
  - Poder evolucionar y migrar los módulos de forma independiente (hay módulos con más peso, otros que apenas se usan, otros críticos), en la actualidad la migración del monolito pone en riesgo la compañía y se busca no repetir el mismo fallo en migraciones a futuro.
  - Poder ofrecer a los clientes (hospitales) un _buffet_ personalizable de módulos (pasas de vender un producto a N productos y puedes entrar en otros segmentos de mercado, por ejemplo, clínicas más pequeñas o especializadas)

Cada módulo puede llevar entre 3 y 6 meses implementación:

- El primer módulo y arranque del segundo (integraciones) se arrancan como muestra / guía.
- Se arman una serie de equipos para trabajar en paralelo en diferentes módulos.
- Se identifican unos perfiles cross para coordinar la funcionalidad transversal.

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos las dependencias.

```bash
npm install
```

Creamos una nueva carpeta para el módulo de tareas, lo llamaremos `tasks`.

```bash
cd src
cd modules
mkdir tasks
```

Vamos a crear una escena, en esta vamos a mostrar listado y edición inline de una tareas.

_./src/modules/tasks/scenes/task-collection.scene.tsx_

```tsx
export const TaskCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Task Scene</h1>
    </div>
  );
};
```

Creamos un barrel:

_./src/modules/tasks/scenes/index.ts_

```tsx
export * from "./task-collection.scene";
```

Vamos a definir las rutas:

_./src/modules/tasks/core/routing/tasks.routes.const.ts_

```tsx
// TODO: esto se podía hacer parametizable
// Así el módulo standalone podría ir con ruta raíz y el módulo integrado con ruta /tasks
const baseTasksModuleRoutes = "/tasks";

const genPath = (path: string) => `${baseTasksModuleRoutes}${path}`;

export const MODULE_TASKS_ROUTES = {
  TASK_COLLECTION: genPath("/task-collection"),
};
```

Y definimos el routing:

_./src/modules/tasks/core/routing/tasks.router.tsx_

```tsx
import { MODULE_TASKS_ROUTES } from "./tasks.routes.const";

import { TaskCollectionScene } from "@tasks/scenes";

export const moduleTasksRoutes = [
  {
    path: MODULE_TASKS_ROUTES.TASK_COLLECTION,
    element: <TaskCollectionScene />,
  },
];
```

Creamos un barrel:

_./src/modules/tasks/core/routing/index.ts_

```tsx
export * from "./tasks.routes.const";
export * from "./tasks.router";
```

Vamos a definir el query provider para este módulo:

_./src/modules/tasks/core/react-query/query.ts_

```tsx
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

Definimos un barrel:

_./src/modules/tasks/core/react-query/index.ts_

```tsx
export * from "./query";
```

Y definimos el root provider:

_./src/modules/tasks/root-provider/index.tsx_

```tsx
import React from "react";
import { queryClient } from "@teams/core/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export const ModuleTasksRootProviders: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
```

Vamos a definir un punto de entrada a nivel de módulo:

_./src/modules/tasks/index.ts_

```tsx
export * from "./core/root-provider";
export * from "./core/routing";
```

Pasamos a integrarlo en la aplicación principal:

_./src/core/routing/main-app-router.tsx_

```diff
import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { moduleHomeRoutes } from "@home/core/routing";
import { moduleTeamsRoutes, ModuleTeamRootProviders } from "@teams/index";
+ import { moduleTasksRoutes, ModuleTasksRootProviders } from "@tasks/index";
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
          {moduleHomeRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {moduleTeamsRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
+      <Route
+          element={
+            <ModuleTasksRootProviders>
+              <Outlet />
+              <ReactQueryDevtools />
+            </ModuleTasksRootProviders>
+          }
+        >
+          {moduleTasksRoutes.map((route: any) => (
+            <Route key={route.path} path={route.path} element={route.element} />
+          ))}
+        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

Vamos a añadir un enlace en la página principal de la aplicación (ojo aquí esta página es un _sumidero_ de dependencias, habría que ver la forma de sacar un router global que pudiera ser accedido desde cualquier módulo):

_./src/modules/home/scenes/dashboard.scene.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { MODULE_TEAMS_ROUTES } from "@teams/core/routing";
+ import { MODULE_TASKS_ROUTES } from "@tasks/core/routing";
import { GithubCollectionPod } from "@teams/pods";
import classes from "./dashboard.scene.module.css";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className={classes.container}>
        <GithubCollectionPod />
        <div>
-          <h1>Place holder for tasks</h1>
+          <Link to={MODULE_TASKS_ROUTES.TASK_COLLECTION}>Navigate to tasks module</Link>
        </div>
      </div>
      <Link to={MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION}>
        Go to member collection
      </Link>
    </div>
  );
};
```

Vamos a probarlo...

```bash
npm run dev
```
