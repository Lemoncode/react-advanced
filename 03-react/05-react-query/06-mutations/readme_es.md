# Mutaciones

Hasta ahora hemos usado React Query en modo lectura, ¿Pero que pasa con las escrituras? Aquí podemos beneficiarnos de varias ventajas:

- Poder meter en el ciclo de actualizaciones / cache las mutaciones.
- Poder realizar updates optimistas.

En este ejemplo arrancaremos por explorar más escenarios de lectura y después pasaremos a escritura.

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos las dependencias.

```bash
npm install
```

También vamos a levantar un backend de pruebas:

```bash
cd 99-server
```

Vamos a crear el pod de tareas:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```tsx
export const TaskCollectionPod: React.FC = () => {
  return (
    <div>
      <h1>Task Collection POD</h1>
    </div>
  );
};
```

Lo exponemos como barrel bajo la carpeta `pods`:

_./src/modules/tasks/pods/index.ts_

```tsx
export * from "./task-collection/task-collection.pod";
```

Y lo usamos en la escena de task-collection:

_./src/modules/tasks/scenes/task-collection.scene.tsx_

```diff
+ import { TaskCollectionPod } from "@tasks/pods";

export const TaskCollectionScene: React.FC = () => {
  return (
    <div>
-      <h1>Task Scene</h1>
+      <TaskCollectionPod />
    </div>
  );
};
```

Probamos que lo hemos creado bien:

```bash
npm run dev
```

Para acceder la servidor, lo suyo es que la API base la metamos en una variable de entorno (aquí si creamos módulos separados cada módulo tendría la suya) ¿Podría tener esto un problema con los despliegues?

- Lo que es Front End nunca va en el area de variables de entornos que podemos tener en un servidor en la nube, se reemplaza en tiempo de build.
- Si podría ser un problema si queremos que se cambie la URL de base desde la aplicación principal, en ese caso podríamos optar por meter un punto de entrada para que la aplicación decidiera la URL de base (sobreescribiendo la variable de entorno)
- He visto escenario más complejo donde esta configuración la sirve un servicio web externo, de esta manera puedes servir despliegues para diferentes proveedores.

./.env

```diff
VITE_GITHUB_API_BASE_URL=https://api.github.com
+ VITE_TASKS_API_BASE_URL=http://localhost:3000
```

Y vamos a tiparlo:

./src/core/env/index.ts

```diff
interface EnvVariables {
  GITHUB_API_BASE_URL: string;
+ TASKS_API_BASE_URL: string;
}

export const ENV_VARIABLES: EnvVariables = {
  GITHUB_API_BASE_URL: import.meta.env.VITE_GITHUB_API_BASE_URL,
+ TASKS_API_BASE_URL: import.meta.env.VITE_TASKS_API_BASE_URL,
};

```

Ahora queremos cargar una lista de tareas, vamos a simular que vamos a por el pod completo (para esta caso sería un _overkill_):

Instalamos zod:

```bash
npm install zod
```

Vamos a definir el esquema de ZOD y el modelo de datos, tenemos para tarea, los siguientes campos:

- id: numérico.
- description: string.
- isDone: booleano.

_./src/modules/tasks/pods/tasks-collection/api/api.model.ts_

```ts
import { z } from "zod";

export const taskApiSchema = z.object({
  id: z.number(),
  description: z.string(),
  isDone: z.boolean(),
});

// Y para un array de tasks
export const taskApiCollectionSchema = z.array(taskApiSchema);

export type TaskModel = z.infer<typeof taskApiSchema>;
```

Vamos ahora a definir el fichero de API en el que vamos a leer del endpoint _localhost:3000/tasks_, para ello usaremos axios, y tiraremos de nuestra variable de entorno, también haremos un _safeParse_ con ZOD por si algo cambia en el módelo de la API (de momento lo que hacemos es informar con un console log de que ha habido un cambio en el modelo de la API, aquí podríamos plantearnos logging).

_./src/modules/tasks/pods/tasks-collection/api/api.ts_

```ts
import axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { taskApiCollectionSchema, TaskModel } from "./api.model";

export const getTaskCollection = async (): Promise<TaskModel[]> => {
  const { data } = await axios.get<TaskModel[]>(
    `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`
  );

  const result = taskApiCollectionSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }

  return data ?? [];
};
```

Vamos ahora a definir el viewModel:

_./src/modules/tasks/pods/tasks-collection/task-collection.vm.ts_

```ts
export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}
```

Y vamos a crear el mapper:

_./src/modules/tasks/pods/tasks-collection/task-collection.mapper.ts_

```ts
import * as apiModel from "./api/api.model";
import * as vm from "./task-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TaskVm => ({
  ...task,
});
```

Y vamos a crear una fichero de repositorio para no tener que tratar desde el componente con el modelo de la api.

_./src/modules/tasks/pods/tasks-collection/task-collection.repository.ts_

```ts
import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm } from "./task-collection.mapper";
import * as vm from "./task-collection.vm";
import { getTaskCollection as getTaskCollecionApi } from "./api/api";

export const getTaskCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};
```

Vamos a darle uso a _React Query_ para cargar la lista de tareas (he implementamos lo mínimo para ver que salen datos):

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import { useQuery } from "react-query";
+ import {getTaskCollection} as repository from "./task-collection.repository";
+ import { TaskVm } from "./task-collection.vm";

export const TaskCollectionPod: React.FC = () => {

+ // De momento harcodeamos la key
+ const { data: taskCollection = [] } = useQuery({
+  queryKey: ["taskCollection"],
+  queryFn: () => repository.getTaskCollection()
+ });

  return (
    <div>
      <h1>Task Collection POD</h1>
      {
+      taskCollection.map((task) => (
+        <div key={task.id}>
+          <span>{task.description}</span>
+        </div>
      }
    </div>
  );
};
```

Probamos que funciona:

```bash
npm run dev
```

Siguiente paso vamos a organizar las _keys_ que estamos usando para evitar meter harcodeos por todos sitios:

_./src/modules/tasks/core/react-query/query-key.ts_

```ts
export const queryKeys = {
  all: ["tasks"] as const,
  taskCollection: () => [...queryKeys.all, "taskCollection"] as const,
};
```

Lo añadimos la index del barrel:

_./src/modules/tasks/core/react-query/index.ts_

```diff
+ export * from "./query-key";
export * from "./query";
```

Y vamos a refactorizar la query del pod:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import { queryKeys } from "@tasks/core/react-query";

// (...)
- // De momento harcodeamos la key
 const { data: taskCollection = [] } = useQuery({
-  queryKey: "taskCollection",
+  queryKey: queryKeys.taskCollection(),
  queryFn: () => repository.getTaskCollection()
 });
```

Y ya que estamos lo sacamos a un hook:

_./src/modules/tasks/pods/tasks-collection/use-task-collection-query.hook.ts_

> También podríamos llamar el fichero: `use-task-collection.query.ts` ¿Que crees que es mejor?

```ts
import { queryKeys } from "@tasks/core/react-query";
import { getTaskCollection } from "./task-collection.repository";
import { useQuery } from "@tanstack/react-query";
import { TaskVm } from "./task-collection.vm";

export const useTaskCollectionQuery = () => {
  const { data: taskCollection = [] } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  });

  return {
    taskCollection,
  };
};
```

Refactorizamos el pod:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
- import { useQuery } from "@tanstack/react-query";
- import { queryKeys } from "@tasks/core/react-query";
- import { getTaskCollection } from "./task-collection.repository";
- import { TaskVm } from "./task-collection.vm";
+ import { useTaskCollectionQuery } from "./use-task-collection-query.hook";

export const TaskCollectionPod: React.FC = () => {
-  const { data: taskCollection = [] } = useQuery<TaskVm[]>({
-    queryKey: queryKeys.taskCollection(),
-    queryFn: () => getTaskCollection(),
-  });
+ const { taskCollection } = useTaskCollectionQuery();
```
