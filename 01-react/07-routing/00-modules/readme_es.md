# 07 Routing 00 Modules

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

- Primero copiamos el ejemplo 00-boiler-plate, y hacemos un _npm install_

```bash
npm install
```

- Vamos a instalar react-router-dom

```bash
npm install react-router-dom
```

- Un tema interesante de la nueva versión de *React Router* (6.4.2) es que
  permite definir el árbol de rutas como un *array*, así es muy fácil poder romper
  en módulos, y también permite rutas anidadas.

- Imaginemos que tenemos dos módulos separados:

_./src/modules/module-a/a.page.tsx_

```tsx
import React from "react";

export const PageA = () => {
  return (
    <div>
      <h2>Module A - Page A</h2>
    </div>
  );
};
```

_./src/modules/module-a/b.page.tsx_

```tsx
import React from "react";

export const PageB = () => {
  return (
    <div>
      <h2>Modulo A - Page B</h2>
    </div>
  );
};
```

_./src/modules/module-b/a.page.tsx_

```tsx
import React from "react";

export const PageA = () => {
  return (
    <div>
      <h2>Module B - Page A</h2>
    </div>
  );
};
```

_./src/modules/module-b/b.page.tsx_

```tsx
import React from "react";

export const PageB = () => {
  return (
    <div>
      <h2>Modulo B - Page B</h2>
    </div>
  );
};
```

- Vamos a definir las rutas para cada módulo, en este caso para evitar colisiones vamos a añadir un nivel de ruta anidada por módulo:

_./src/modules/module-a/routes.tsx_

```tsx
import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    children: [
      {
        path: "page-a",
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
```

_src/modules/module-a/index.ts_

```tsx
export * from "./routes";
```

- Hacemos lo mismo para el módulo B:

_./src/modules/module-b/routes.tsx_

```tsx
import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";

export const routesModuleB: RouteObject[] = [
  {
    path: "module-b",
    children: [
      {
        path: "page-a",
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
```

_src/modules/module-b/index.ts_

```tsx
export * from "./routes";
```

- Definimos una página de entrada para la aplicación:

_./src/home.page.tsx_

```tsx
import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <ul>
        <li>
          <Link to="/module-a/page-a">Module A - Page A</Link>
        </li>
        <li>
          <Link to="/module-a/page-b">Module A - Page B</Link>
        </li>
        <li>
          <Link to="/module-b/page-a">Module B - Page A</Link>
        </li>
        <li>
          <Link to="/module-b/page-b">Module B - Page B</Link>
        </li>
      </ul>
    </div>
  );
};
```

- Vamos ahora a definir el árbol de rutas principal y añadir las rutas de los
  módulos:

_./src/core/routes.tsx_

```tsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "../home.page";
import { routesModuleA } from "../modules/module-a";
import { routesModuleB } from "../modules/module-b";

export const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  ...routesModuleA,
  ...routesModuleB,
]);
```

Y añadimos a nuestro App:

_./src/app.tsx_

```tsx
import React from "react";
import { appRoutes } from "./core/routes";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  return <RouterProvider router={appRoutes} />;
};
```

Hora de probar :)

```bash
npm start
```

- Vamos a meter un elemento que diga en que módulo estoy:

_./src/module-a/module-a.layout.tsx_

```tsx
import React from "react";
import { Outlet } from "react-router-dom";

export const ModuleALayout = () => {
  return (
    <div>
      <h1>Module A</h1>
      <Outlet />
    </div>
  );
};
```

_./src/module-b/module-b.layout.tsx_

```tsx
import React from "react";
import { Outlet } from "react-router-dom";

export const ModuleBLayout = () => {
  return (
    <div>
      <h1>Module B</h1>
      <Outlet />
    </div>
  );
};
```

- Y modificamos las rutas de cada uno:

_./src/modules/module-a/routes.tsx_

```diff
import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
+ import { ModuleALayout } from "./module-a.layout";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
+    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
```

_./src/modules/module-b/routes.tsx_

```diff
import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
+ import { ModuleBLayout } from "./module-b.layout";

export const routesModuleB: RouteObject[] = [
  {
    path: "module-b",
+    element: <ModuleBLayout />,
    children: [
      {
        path: "page-a",
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];

```
