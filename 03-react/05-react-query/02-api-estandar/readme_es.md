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

- Siguiente paso, vamos a cargar la lista de miembros:

Para la complejidad de este proyecto podríamos directamente meter un _axios_ o _fetch_ directamente en el componente y tirar millas.

En este caso nos vamos a complicar la vida, simulando que estamos en un proyecto más complejo, ... que no nos gusta de usar el fetch directamente en el componente:

- Lo normal en un proyecto grande es que el modelo que se recibe del servidor, no se ajusta a lo que pide el cliente al 100%:

  - Algo tan tonto como gestionar fechas, suelen venir serializadas de la API en un formato dado y seguramente las queramos pasar a objeto Date y viceversa.

  - O comprobaciones de datos, muchas veces las APIs nos devuelven null en ciertos campos y mejor convertirlo a valores fáciles de manejar (como 'Desconocido', 'Seleccione uno', '-1'...).

  - O estructuras de datos que necesitan de un masaje previo para ser consumidas por el cliente.

  - El objetivo es "vaciar el cangrejo", es decir que el componente se dedique a lo que es bueno, gestionar el interfaz de usuario, y el resto lo saquemos a piezas que hacen una cosa y una sola cosa, que además sean fáciles de testear.

Así que nos vamos a complicar la vida :).

De momento lo único que sabemos es que vamos a usar este acceso de datos sólo en este pod (depende del proyecto, pero quizás un 70% de las ocasiones te pase esto), así que vamos a definir la api y mapeadores dentro del pod.

> ¿Y para el 30% de casos restantes? Aquí podemos tener una carpeta _/core/api_ donde definimos las API's comunes.

Nos vamos a instalar _Axios_

```bash
npm install axios
```

Echamos un ojo a la API de github:

```
https://api.github.com/orgs/lemoncode/members
```

Dentro del pod vamos a definir una subcarpeta _api_, donde vamos a definir el modelo de api y el acceso a la API Rest de turno.

_./src/pods/github-collection/api/github-collection.model.ts_

```ts
export interface GithubMemberApiModel {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
```

_.src/pods/github-collection/api/github-collection.api.ts_

```ts
import Axios from "axios";
import { GithubMemberApiModel } from "./github-collection.model";

getGithubMembers = async (
  organization: string
): Promise<GithubMemberApiModel[]> => {
  const { data } = await Axios.get<GithubMemberApiModel[]>(
    `https://api.github.com/orgs/${organization}/members`
  );
  return data;
};
```

Esto no esta mal, pero hay dos cosas que chirrían:

- Por un lado la API base, lo suyo es que sea configurable (nos podemos incluso montar nuestro server mock si hace falta).

- Por otro ¿Quien te garantiza que Github no puede cambiar el modelo? Si te fijas estas API no tienen ruta de versionado, seguramente hagan cambios que no rompan, pero ¿No sería bueno que al final nos avisara de si pasa algo?

Vamos a instalar _zod_:

```bash
npm install zod
```

Y ahora le damos una vuelta definimos el esquema de ZOD y generamos el modelo.

**Borrar el contenido de _./src/pods/github-collection/api/model.ts_**

_.src/pods/github-collection/api/gihub.collection.model.ts_

```ts
import { z } from "zod";

// Definiendo el esquema Zod para la entidad
const GithubMemberSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().optional(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
});

// Inferir la interfaz TypeScript desde el esquema Zod
export type GithubMemberApiModel = z.infer<typeof GithubMemberSchema>;

// Se podría mirar de hacer algo genérico con esto
export const validateGithubMember = (data: unknown): boolean => {
  const validationResult = GithubMemberSchema.safeParse(data);
  if (!validationResult.success) {
    // Se podría usar un logger
    console.warn(
      `La API de Github Member ha cambiado: ${validationResult.error}`
    );
  }

  return validationResult.success;
};
```

Y ahora en la API:

_.src/pods/github-collection/api/github-collection.api.ts_

```diff
import Axios from "axios";
- import { GithubMemberApiModel } from "./github-collection.model";
+ import { GithubMemberApiModel, validateGithubMember } from "./model";

getGithubMembers = async (
  organization: string
): Promise<GithubMemberApiModel[]> => {
  const { data } = await Axios.get<GithubMemberApiModel[]>(
    `https://api.github.com/orgs/${organization}/members`
  );

+  validateGithubMember(data);

  return data;
};
```

Vamos a sacar la URL como una variable de entorno:

_.env_

```env
VITE_GITHUB_API_BASE_URL=https://api.github.com
```

Y vamos a crear un helper para tipar las variables de entorno:

_.src/core/env/index.ts_

```ts
interface EnvVariables {
  GITHUB_API_BASE_URL: string;
}

export const ENV_VARIABLES: EnvVariables = {
  GITHUB_API_BASE_URL: import.meta.env.VITE_GITHUB_API_BASE_URL,
};
```

Sobre variables de entorno:

- Las variables de entorno en Front end van tal cual al bundle JS que se sirve en el navegador, NUNCA debemos de poner datos sensibles en FRONT.

- Es buena práctica meter en el .gitignore el fichero _.env_ para evitar que se cuelen en el repositorio valores de producción por accidente.

- Lo que nosotros solemos hacer es crear un fichero _env.example_ y en el post install del package.json copiarlo a _.env_ si no existe.

Vamos a usarlo en la API:

_.src/pods/github-collection/api/github-collection.api.ts_

```diff
import Axios from "axios";
+ import { ENV_VARIABLES } from "@/core/env";
import { GithubMemberApiModel, GithubMemberSchema } from "./model";

getGithubMembers = async (
  organization: string
): Promise<GithubMemberApiModel[]> => {
  const { data } = await Axios.get<GithubMemberApiModel[]>(
-    `https://api.github.com/orgs/${organization}/members`
+    `${ENV_VARIABLES.GITHUB_API_BASE_URL}/orgs/${organization}/members`
  );

  validateGithubMember(data);

  return data;
};
```

Y creamos un barrel:

_.src/pods/github-collection/api/index.ts_

```ts
export * from "./github-collection.api";
export * from "./github-collection.model";
```

Ya tenemos la llamada a la API lista, vamos ahora a definir el view modelo que vamos a usar en el componente (en este caso es más simple):

_./src/pods/github-collection/github-collection.vm.ts_

```ts
export interface GithubMemberVm {
  id: string;
  name: string;
  avatarUrl: string;
}
```

Y ahora vamos a crear un mapeador que nos convierta de un modelo a otro:

_./src/pods/github-collection/github-collection.mapper.ts_

```ts
import { GithubMemberApiModel } from "./api";
import { GithubMemberVm } from "./github-collection.vm";

export const mapGithubMemberFromApiToVm = (
  githubMember: GithubMemberApiModel
): GithubMemberVm => ({
  id: githubMember.id.toString(),
  name: githubMember.login,
  avatarUrl: githubMember.avatar_url,
});
```

Ahora nos tenemos que plantear dos escenarios.

Uno sería hacer la carga de la API en el componente y hacer el mapeo en el componente:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import React from "react";
+ import { getGithubMembers } from "./api/github-collection.api";
+ import { mapGithubMemberFromApiToVm } from "./github-collection.mapper";
+ import { GithubMemberVm } from "./github-collection.vm";

export const GithubCollectionPod: React.FC = () => (
+ const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm
+
+ React.useEffect(() => {
+   const loadGithubMembers = async () => {
+     const apiGithubMembers = await getGithubMembers("lemoncode");
+     const viewGithubMembers = apiGithubMembers.map((apiGithubMember) =>
+       mapGithubMemberFromApiToVm(apiGithubMember)
+     );
+     setGithubMembers(viewGithubMembers);
+   };
+
+    loadGithubMembers();
+  }, []);


  <div>
-    <h1>Github collection POD</h1>
+    {
+      githubMembers.map((githubMember) => (
+        <div key={githubMember.id}>
+          <img src={githubMember.avatarUrl} />
+          <span>{githubMember.name}</span>
+        </div>
+    ))}
  </div>
);
```

Aquí se queda todo en el fichero, y cuando veamos React Query, puede que esto haga que para queries comunes sea más fácil meterlas en caché.

Por otro lado estamos manchando el componente con código que no le toca.

¿Y si creamos un fichero que podemos llamar _repository_ que se encargue de hacer la llamada a la API y el mapeo?

_./src/pods/github-collection/github-collection.repository.ts_

```ts
import { getGithubMembers } from "./api/github-collection.api";
import { mapGithubMemberFromApiToVm } from "./github-collection.mapper";
import { GithubMemberVm } from "./github-collection.vm";

export const getGithubMembersCollection = async (
  organization: string
): Promise<GithubMemberVm[]> => {
  const apiGithubMembers = await getGithubMembers(organization);
  const viewGithubMembers = apiGithubMembers.map((apiGithubMember) =>
    mapGithubMemberFromApiToVm(apiGithubMember)
  );
  return viewGithubMembers;
};
```

Ahora en el componente simplificamos:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import React from "react";
- import { getGithubMembers } from "./api/github-collection.api";
- import { mapGithubMemberFromApiToVm } from "./github-collection.mapper";
+ import { getGithubMembersCollection } from "./github-collection.repository";

export const GithubCollectionPod: React.FC = () => (
 const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm

 React.useEffect(() => {
   const loadGithubMembers = async () => {
-     const apiGithubMembers = await getGithubMembers("lemoncode");
-     const viewGithubMembers = apiGithubMembers.map((apiGithubMember) =>
-       mapGithubMemberFromApiToVm(apiGithubMember)
-     );
-     setGithubMembers(viewGithubMembers);
+    const members = await getGithubMembersCollection("lemoncode");
+    setGithubMembers(members);
   };
```

Vamos a probarlo:

```bash
npm run dev
```

Vamos a darle un poco de estilo a la lista:

Primero instalamos una clase para hacer compose de varias clases CSS:

```
npm install classnames
```

_./src/pods/github-collection/github-collection.component.module.css_

```css
.container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}

.header {
  background-color: #2f4858;
  color: white;
  font-weight: bold;
}

.container > img {
  width: 80px;
}

.some-additional-class {
  border: 2px solid #bc5b40;
  background-color: #fbfaf0;
}
```

_./src/pods/github-collection/github-collection.component.tsx_

```tsx
import React from "react";
import { GithubMemberVm } from "./github-collection.vm";
import classNames from "classnames";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/core/routing";
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
        <>
          <img src={member.avatarUrl} />
          <span>{member.id}</span>
          <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: member.name })}>
            {member.name}
          </Link>
        </>
      ))}
    </div>
  );
};
```

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubMemberVm } from "./github-collection.vm";
+ import { GithubCollectionComponent } from "./github-collection.component";
```

```diff
+ import { GithubCollectionComponent } from "./github-collection.component";

// (...)

  return (
    <div>
-      {githubMembers.map((githubMember) => (
-        <div key={githubMember.id}>
-          <img src={githubMember.avatarUrl} />
-          <span>{githubMember.name}</span>
-        </div>
-      ))}
+      <GithubCollectionComponent githubMembers={githubMembers}>
    </div>
  );
```

Vamos a ver que tal queda:

```bash
npm run dev
```

Vamos ahora a crear la página de detalle:

_./src/pods/github-member/github-member.pod.tsx_

```tsx
import React from "react";

export const GithubMemberPod: React.FC = () => {
  return (
    <div>
      <h1>Github Member Pod</h1>
    </div>
  );
};
```

Creamos un barrel:

_./src/pods/github-member/index.ts_

```diff
export * from "./github-member.pod";
```

También lo añadimos al barrel que cuelga del pod:

_./src/pods/index.ts_

```diff
export * from "./github-collection";
+ export * from "./github-member";
```

Y vamos usarlo en la escena:

./src/scenes/github-member.scene.tsx

```diff
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";
+ import { GithubMemberPod } from "@/pods";

export const GithubMemberScene: React.FC = () => {
  return (
    <div>
-      <h1>Github Member</h1>
+      <GithubMemberPod/>
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>
        Back to member collection
      </Link>
    </div>
  );
};
```

Probamos que funciona:

```bash
npm start
```

Pasa una cosa ahora:

- En la escena recibimos el _id_ (nombre) del usuario que queremos visualizar (queremos mantener el pod libre de esa dependencia).

- Se la pasamos como prop al pod.

_./src/scenes/github-member.scene.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import { GithubMemberPod } from "@/pods";

export const GithubMemberScene: React.FC = () => {
+ const { id } = useParams<{ id: string }>();

  return (
    <div>
-      <GithubMemberPod />
+     <GithubMemberPod id={id ?? ""} />
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>
        Back to member collection
      </Link>
    </div>
  );
};
```

Y en el pod vamos a leer este dato:

_./src/pods/github-member/github-member.pod.tsx_

```diff
import React from "react";

+ interface Props {
+   id: string;
+ }

- export const GithubMemberPod: React.FC = () => {
+ export const GithubMemberPod: React.FC<Props> = (props) => {
+  const { id } = props;

  return (
    <div>
-      <h1>Github Member Pod</h1>
+     <h1>{id}</h1>
    </div>
  );
};

```

La llamada que queremos hacer es:

Vamos ahora a definir el modelo de API

```bash
https://api.github.com/users/brauliodiez
```

_./pods/github-member/api/github-member.model.ts_

```ts
import { z } from "zod";

const GitHubMemberSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().optional(),
  url: z.string(),
  html_url: z.string(),
  name: z.string(),
  bio: z.string(),
  company: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
});

export type GitHubMember = z.infer<typeof GitHubMemberSchema>;

export const validateGithubMember = (data: unknown): boolean => {
  const validationResult = GitHubMemberSchema.safeParse(data);
  if (!validationResult.success) {
    // Se podría usar un logger
    console.warn(
      `La API de Github User ha cambiado: ${validationResult.error}`
    );
  }

  return validationResult.success;
};
```

la llamada a la API

_./pods/github-member/github-member.api.ts_

```ts
import Axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { GitHubMember, validateGithubMember } from "./github-member.model";

export const getGithubMember = async (
  userName: string
): Promise<GitHubMember> => {
  const { data } = await Axios.get<GitHubMember>(
    `${ENV_VARIABLES.GITHUB_API_BASE_URL}/users/${userName}`
  );

  validateGithubMember(data);

  return data;
};
```

El view model:

_./pods/github-member/github-member.vm.ts_

```ts
export interface GithubMemberVm {
  id: string;
  login: string;
  name: string;
  company: string;
  avatarUrl: string;
  bio: string;
}

export const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
  name: "",
  company: "",
  avatarUrl: "",
  bio: "",
});
```

Creamos un barrel:

_./pods/github-member/api/index.ts_

```ts
export * from "./github-member.api";
export * from "./github-member.model";
```

El Mapper:

_./pods/github-member/github-member.mapper.ts_

```ts
import { GithubMemberApiModel } from "./api";
import { GithubMemberVm } from "./github-member.vm";

export const mapGithubMemberFromApiToVm = (
  githubMember: GithubMemberApiModel
): GithubMemberVm => ({
  id: githubMember.id.toString(),
  login: githubMember.login,
  name: githubMember.name,
  avatarUrl: githubMember.avatar_url,
  company: githubMember.company,
  bio: githubMember.bio,
});
```

Y el repository

_./pods/github-member/github-member.repository.ts_

```ts
import { getGithubMember } from "./api";
import { mapGithubMemberFromApiToVm } from "./github-member.mapper";
import { GithubMemberVm } from "./github-member.vm";

export const getGithubMemberDetail = async (
  userName: string
): Promise<GithubMemberVm> => {
  const apiGithubMember = await getGithubMember(userName);
  const viewGithubMember = mapGithubMemberFromApiToVm(apiGithubMember);
  return viewGithubMember;
};
```

Hacemos la llamada en el pod

_./pods/github-member/github-member.pod.tsx_

```diff
import React from "react";
+ import { createDefaultMemberDetail } from "./github-member.vm";
+ import { getGithubMemberDetail } from "./github-member.repository";


export const GithubMemberPod: React.FC = () => {
    const { id } = props;
+   const [member, setMember] = React.useState(createDefaultMemberDetail());
+
+ React.useEffect(() => {
+   const loadGithubMember = async () => {
+     const member = await getGithubMemberDetail(id);
+     setMember(member);
+   };
+  loadGithubMember();
+ }, []);

  return (
    <div>
-      <h1>Github Member Pod</h1>
+      <h1>{member.name}</h1>
    </div>
  );
};
```

Vamos a crear un componente presentacional:

Estilos

_./src/pods/github-member/github-member.component.module.css_

```css
.container {
  display: grid;
  grid-template-columns: 80px 1fr 3fr;
  grid-template-rows: 20px;
  grid-auto-rows: 80px;
  grid-gap: 10px 5px;
}
```

Componente

_./src/pods/github-member/github-member.component.tsx_

```tsx
import React from "react";
import { GithubMemberVm } from "./github-member.vm";
import classNames from "classnames";

interface Props {
  githubMember: GithubMemberVm;
}

export const GithubMemberComponent: React.FC<Props> = (props) => {
  const { githubMember } = props;

  return (
    <div className={classNames(classes.container, classes.someAdditionalClass)}>
      <span className={classes.header}>Avatar</span>
      <span className={classes.header}>Name</span>
      <span className={classes.header}>Bio</span>
      <img src={githubMember.avatarUrl} />
      <span>{githubMember.id}</span>
      <span>{githubMember.bio}</span>
    </div>
  );
};
```

Vemos que tal se ve:

```bash
npm run dev
```
