# Hola Pods y React Query

Hemos estado hablando de como estructurar un proyecto y ahora vamos a ver como funciona React Query, una librería que va a cambiar tu forma de acceder a datos cuando desarrolles una aplicación SPA.

En este ejemplo seguir PODS podría considerarse _matar moscas a cañonazo_ pero nos va a servir para aceptar conceptos y simular escenarios.

Vamos a simular que implementamos una aplicación que lee de una API de terceros (un módulo que tira de la API de Github), y después implementaremos otro módulo que va servir para gestionar las tareas de un usuario.

Este ejemplo tan tonto, podrías extrapolarlo a una herramienta en la que tuvieras un interfaz para simplificar la interacción con tu repositorio (ramas, commits, ci/cd), y por otro lado un portal de gestíon del proyecto (aaaah diooos !!! el JIRA... XDDD)

¿Cómo vamos a hacerlo? De primero yendo a por lo simple pero bien estructurado, y realizando refactors conforme nos vaya haciendo falta.

# Paso a paso

Partimos del boiler plate de este curso e instalamos la dependencias.

```bash
npm install
```

Nos olemos que esta proyecto va a crecer así que vamos a seguir una estructura de pods de un nivel.

De momento creamos las siguientes carpetas:

- `src/core`
- `src/scenes`

Ya crearemos más, o haremos cambios cuando nos haga falta.

Para la navegación vamos a utilizar _react-router_ A tener en cuenta:

- Existen muchos otros routers SPA.
- Alguno promete, como _TanStack router_: https://tanstack.com/router/v1
- También existen frameworks con su propio router, como _NextJS_ o _Remix_ (aunque _Remix_ se ha integrado en _React Router_).

¿Por qué elegir _React Router_?

- Es un proyecto maduro, la primera versión es de noviembre de 2021.
- Siguen en activo (ultima release, mayo de 2024).
- Es una librería muy popular, con una comunidad muy activa.
- Es el estándar que se usa en muchas empresas.
- Tiene muchos casos implementados.
- Sirve como marketing y punto de entrada para Remix (proyecto comprado por Shopify).
- Las aplicaciones SPA si bien son útiles y tienen un nicho de mercado, parece que no van a evolucionar de forma drástica, el foco está en Server Components.

¿Cuando NO elegiríamos React Router?

- Si detectamos casuísticas importantes que no cubre bien este framework.
- Si la comunidad ha decidido apostar por otro framework en firme.
- Si el proyecto deja de tener mantenimiento.
- Si queremos ir por SSR o SSG o Framework, ... bueno ahora React Router si puede ofrecer estás cosas por que se ha integrado con Remix, pero habría que hace run estudio aparte.

- Vamos a instalarlo:

```bash
npm install react-router-dom --save
```

- Vamos crear escenas (páginas):

Página principal:

_./src/scenes/dashboard.scene.tsx_

```tsx
import React from "react";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};
```

Listado de miembros de Github

_./src/scenes/github-member-collection.scene.tsx_

```tsx
import React from "react";

export const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
    </div>
  );
};
```

Detalle de un miembro de Github

_./src/scenes/github-member.scene.tsx_

```tsx
import React from "react";

export const GithubMemberScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member</h1>
    </div>
  );
};
```

Creamos un barrel:

_./src/scenes/index.ts_

```tsx
export * from "./dashboard.scene";
export * from "./github-member-collection.scene";
export * from "./github-member.scene";
```

¿Verás que hay ocasiones en las que para carpetas _root_ creamos un barrel y para otras no? ¿Qué regla seguimos?

- En una carpeta raíz seguramente tengamos subcarpetas que a su vez expondrán un barrel con más elementos.

- Aquí nos podemos preguntar ¿Cuantos elementos voy a exportar por carpeta y si pueden haber colisiones o nombres que nos lleven a equívocos:

  - En la carpeta _scenes_ casi seguro que vamos a exportar un elemento por carpeta y cada página tendrá un nombre único (en caso de no ser así, o tener una organización por submódulos no lo haríamos).

  - La carpeta pods también es candidata.

  - Una carpeta _core_ o _common_ puede que aglutine una amalgama de de subcarpetas y unos exports de subcarpetas más abultados, aquí es mejor plantear los imports a nivel de subcarpeta, por ejemplo:
    - core/security
    - core/routing

Por otro lado no hemos creado subcarpetas para cada escena ¿Por qué? Porque en las escenas seguramente tengamos un sólo fichero, a lo sumo dos (css y escena), si tuviéramos más ficheros (puede ser que _spec_ o que una escena se rompiera en varios), sí nos plantearíamos crear subcarpetas, pero también sería un mal olor, una escena debe de ser algo muy simple, la riqueza debe de estar en los pods, o en common / core...

Cómo hemos comentado, en la escena:

- Elegiremos layout (esto se puede hacer también a nivel de router).
- Gestionaremos los parámetros de navegación del router.

Vamos ahora a definir las rutas:

- Vamos a tener una ruta de listado de miembros.
- Vamos a tener una ruta de detalle de miembro, ésta tendrá definido un parámetro del routing.

Definimos el enrutado:

Para evitar _strings mágicos_ generamos un listado de rutas.

_./src/core/routing/routes.const.tsx_

```tsx
export const ROUTES = {
  HOME: "/",
  GITHUB_MEMBER_COLLECTION: "/github-members",
  GITHUB_MEMBER: "/github-member/:id",
};
```

> Estos ficheros de constantes pueden ser un dolor en SonarQ cuando tienes requisitos de cobertura de código altos, en muchos casos es un sinsentido que te obliguen a testear un fichero de constantes, ¿Qué opciones tenemos? Una es añadir una regla a SonarQ indicando que ignore los ficheros con extensión _const.tsx_ para el cálculo de cobertura de código, otra, asumir que otro fichero lo referenciará e indirectamente se manchará es fichero (depende con quien hables te puede decir que esto es algo sucio...).

Y ahora enlazamos las escenas con las rutas:

_./src/core/routing/router.tsx_

```tsx
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";

// Esto va a fallar (alis)
import {
  DashboardScene,
  GithubMemberScene,
  GithubMemberCollectionScene,
} from "@/scenes/";

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<DashboardScene />} />
        <Route
          path={ROUTES.GITHUB_MEMBER_COLLECTION}
          element={<GithubMemberCollectionScene />}
        />
        <Route path={ROUTES.GITHUB_MEMBER} element={<GithubMemberScene />} />
      </Routes>
    </HashRouter>
  );
};
```

¿Qué es eso de la `@` que falla? Un alias, lo hacemos para evitar tener que poner rutas relation en los imports que al fina son un lío, si los `import "../../../"`, para definir este alias tenemos que modificar el fichero de configuración de TypeScript y Vite:

_./tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
+    "baseUrl": "./src",
+    "paths": {
+      "@/*": ["*"]
+    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Y el en el `vite.config.ts`:

Antes de modificarlo instalamos los typings de node:

```bash
npm install @types/node --save-dev
```

```diff
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
+ import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
+  resolve: {
+   alias: {
+      '@': fileURLToPath(new URL('./src', import.meta.url)),
+    },
+  },  
})
```


Creamos un barrel:

_./src/core/router/index.ts_

```ts
export * from "./router";
export * from "./routes.const";
```

Vamos a instanciarlo en el punto de entrada de la aplicación:

_./src/App.tsx_

```diff
import "./App.css";
+ import { Router } from "@/core/routing";

function App() {
  return (
    <>
-      <h1>React App Boilerplate</h1>
+      <Router />
    </>
  );
}

export default App;
```

Vemos que arranca y se muestra la página inicial.

```bash
npm run dev
```

Vamos a definir rutas en la aplicación, aquí tenemos un problema:

- Una ruta sin parámetros sería tal cual como la ruta que hemos definido para la navegación: `GITHUB_MEMBER_COLLECTION: "/github-members",`

- Una ruta con parámetros es distinta, es decir en la definición de rutas usamos esto: 
  - `GITHUB_MEMBER: "/github-members/:id`, 
  - En la navegación `GITHUB_MEMBER: "/github-members/18432` (y ésto es un clase simple con un sólo parámetro)

¿Qué podemos hacer? Aquí no hay bala de plata, pero planteamos dos opciones:

- Podemos crear interfaz base de rutas, y otro que extienda de él para las rutas de navegación con parámetros y cambiamos las que toquen por una función (se puede resolver por herencia o usando TypeScript):

  **Ventajas:**

  - En cierta medida abstraemos esta solución de temas específicos de la librería de navegación.

  - Es amigable para el desarrollo (si intento usar la entrada de navegación como si fuera un string me va a dar un fallo ya que tenemos una función).

  - Acumulo toda la complejidad en un sólo fichero (el de rutas).

  **Desventajas**

  - Al final es una especie de hack.
  - Es fácil equivocarse cuando vas a introducir una ruta nueva.
  - No es algo directo para el equipo de desarrollo (si entra una persona nueva, le tienes que explicar lo que "te has inventado")

- Otra opción es atarnos un poco más a _react-router_ y utilizar el helper _generatePath_ así podemos tener una sola ruta:

  **Ventajas:**

  - Estamos aplicando un estándar, es _stackoverflow_ y _chat gpt_ friendly.

  - Nuestro fichero de rutas se queda muy claro.

  **Desventajas**

  - Es más fácil que cometamos fallos tontos al asignar rutas.

En Lemoncode hemos usado la primera aproximación como estándar mucho tiempo, ahora planteamos la segundo opción, vamos a por ella, añadimos enlaces de navegación para probarla:

_./src/scenes/dashboard.scene.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";
+ import { ROUTES } from "core/router";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
+     <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
    </div>
  );
};
```

_./src/scenes/github-member-collection.scene.tsx_

```diff
import React from "react";
+ import { Link, generatePath } from "react-router-dom";
+ import { ROUTES } from "@/core/routing";

const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
+      <Link to={generatePath(ROUTES.GITHUB_MEMBER, {id: "23"})}>Go to member</Link>
    </div>
  );
};
```

Y la de vuelta:

_./src/scenes/github-member/github-member.scene_

```diff
import React from "react";
+ import { Link } from "react-router-dom";
+ import { ROUTES } from "@/core/routing";

const GithubMemberScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member</h1>
+      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Back to member collection</Link>
    </div>
  );
};
```

Vamos a probarlo:

```bash
npm run dev
```
