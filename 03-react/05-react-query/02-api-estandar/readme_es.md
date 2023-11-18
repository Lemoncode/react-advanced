# Api estándar

Vamos a cargar la lista de miembros de github y la ficha de un miembro utilizando _useEffect_, después nos veremos que posibles problemas hemos introducido (suponiendo que esto es un proyecto grande) y que soluiones nos da _react-query_.

Aunque para esta proyecto (con lo pequeño y simple que es) sería sobrearquitectura, vamos a estructurar bien la API y razonar el porqué de cada decisión.

# Paso a paso

Partimos del boiler plate de este curso e instalamos la dependencias.

```bash
npm install
```

## Dashboard

En dashboard queremos mostrar un resumen de la lista de miembros del equipo (de forma rápida podemos por ejemplo comunicarnos con ellos), y tambíen queremos ver la lista de tareas que tenemos pendientes (esto lo no lo tenemos implementado todavía).

Vamos a seguir la aproximación de pods definir la funcionalidad rica, para después usarla como un lego en la escena.

Creamos el pod github-collection

```bash
mkdir -p src/pods/github-collection
```

Creamos el componente de presentación

_src/pods/github-collection/github-collection.pod.tsx_

```tsx
import React from "react";

export const GithubCollectionPod: React.FC = () => (
  <div>
    <h1>Github collection POD</h1>
  </div>
);
```

Creamos un barrel dentro de _GithubCollection_

_src/pods/github-collection/index.ts_

```tsx
export * from "./github-collection.pod";
```

Lo exponemos en el barrel de pods:

_src/pods/index.ts_

```tsx
export * from "./github-collection";
```

Vamos a darle uso a la escena de dashboard.

_src/scenes/dashboard/dashboard.scene.module.css_

```css
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.container > div {
  border: 5px solid #f0f0f0;
  border-radius: 10px;
}
```

_./src/scenes/dashboard/dashboard.scene.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";
+ import { GithubCollectionPod } from "@/pods";
+ import classes from "./dashboard.scene.module.css";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
+     <div className={classes.container}>
+       <GithubCollectionPod />
+       <div>
+         <h1>Place holder for tasks</h1>
+       </div>
+    </div>
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
    </div>
  );
};
```

Y también lo mostraremos en la escena de miembros.

_src/scenes/github-member-collection.scene.tsx_

```diff
import React from "react";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/core/routing";
+ import { GithubCollectionPod } from "@/pods";

export const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
+       <GithubCollectionPod />
      <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: "23" })}>
        Go to member
      </Link>
    </div>
  );
};
```

Vamos a probarlo:

```bash
npm run dev
```
