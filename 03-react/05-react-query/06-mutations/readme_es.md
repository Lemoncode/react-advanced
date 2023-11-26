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

Probamos que funciona:

```bash
npm run dev
```

Vamos a empezar a jugar con las opciones que nos ofrece React Query, primero nos fijamos en _refetchOnWindowFocus_.

Está opción está por defecto a true ¿Qué quiere decir esto?

Vamos a abrir side by side fichero de datos json y la aplicación, y vamos a modificar el json, en cuanto pinchamos en la ventana los datos se recargan sólos.

Si ahora ponemos este flag a false...

_./src/modules/tasks/pods/tasks-collection/use-task-collection-query.hook.ts_

```diff
export const useTaskCollectionQuery = () => {
  const { data: taskCollection = [] } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
+    refetchOnWindowFocus: false
  },
  );
```

Y volvemos a hacer la operación, verás que no se recarga.

Si nos vamos a las devtool, podemos ver:

- Me dice que consultas tengo.

- Qué estado tienen.

- Puedo incluso relanzarlas.

Bueno, hasta aquí el happy path, vamos a tirar abajo la api rest y ver que pasa:

_Paramos al rest api de todos_

Si ponemos un breakpoint en la API podemos ver que no para de llamarse (abrir pestaña network), ¿No sería mejor avisar al usuario y que este reintentará?

_./src/modules/tasks/pods/tasks-collection/use-task-collection-query.hook.ts_

```diff
- export const useTaskCollectionQuery = () => {
+ export const useTaskCollectionQuery = (enabled: boolean) => {
  const {
    data: taskCollection = []
+   isError,
  } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  },
  {
    refetchOnWindowFocus: false,
+    enabled
  });

  return {
    taskCollection,
+   isError
  };
};
```

Y ahora en el pod cubrimos este caso:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";


export const TaskCollectionPod: React.FC = () => {
+ const [connectionLost, setConnectionLost] = React.useState(false);
+
-  const { taskCollection } = useTaskCollectionQuery();
+ const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);

+ React.useEffect(() => {
+   if (isError) {
+     setConnectionLost(true);
+   }
+ }, [isError]);

+ if(isError) {
+   return (<button onClick={() => setConnectionLost(false)}>Reconectar</button>)
+ }

  return (
    <div>
      <h1>Task Collection POD</h1>
      {taskCollection.map((task) => (
        <div key={task.id}>
          <span>{task.description}</span>
        </div>
      ))}
    </div>
  );
};
```

Vale, esto va pero al rato ¿Qué está pasando? Que por defecto react-query antes de dar por perdida una llamada, realiza varios reintentos, vamos a desactivarlo:

_./src/modules/tasks/pods/tasks-collection/use-task-collection-query.hook.ts_

```diff
  } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  },
  {
    refetchOnWindowFocus: false,
    enabled,
+   retry: false
  });
```

Vamos a probar a ver que tal

```bash
npm run dev
```

Vamos ahora a levantar el server y ver que pasa.

¿Para qué casos adicionales nos puede servir esto?

- Si entramos en modo edición y no queremos que se hagan recargas.
- Queremos pausar temporalmente el refetch (incluso probar a trabajar con modo offline).
- ...

Antes de seguir vamos a darle un estilo mínimo a la lista de tareas:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.css_

```css
.todo-list {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 1rem;
  margin: 1rem;
}
```

Y en el markup:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import classes from "./task-collection.pod.module.css";

// (...)

  return (
    <div>
      <h1>Task Collection POD</h1>
+      <div className={classes.todoList}>
      {taskCollection.map((task) => (
-        <div key={task.id}>
-          <span>{task.description}</span>
-        </div>
+          <React.Fragment key={task.id}>
+            <div>{task.isDone ? "✅" : "⭕️"}</div>
+            <div>{task.description}</div>
+          </React.Fragment>
      ))}
+      </div>
    </div>
  );
```

# Mutaciones

Ahora vamos a implementar una funcionalidad para crear un TODO y después implementaremos otra para editar un TODO existente, que nos vamos a plantear:

- Definimos los siguientes estados:
  - Read Only.
  - Append mode
  - Edit mode.
- Crearemos un componente para crear un TODO, este componente consumira un compenente de edición que después aprovecharemos para la edición de uno existente.
- Vamos a crear la entrada de API correspondiente.
- Vamos a enlazarlo todo con React Query.

Vamos a definir los estados:

_./src/modules/tasks/pods/task-collection/task-collection.vm.ts_

```diff
+ export type Mode = "Readonly" | "Append" | "Edit";

export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}
```

Ese estado lo vamos a definir en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
+ import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";

export const TaskCollectionPod: React.FC = () => {
+ const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
```

¿Qué va a hacer nuestro componente de crear TODO?

- De primera si estamos en modo ReadOnly va a mostrar un botón para cambiar a modo Append.
- Si está en modo Append:
  - Va a mostrar un formulario.
  - Un botón para guardar el TODO.
  - Un botón para cancelar la operación.

¿Qué propiedades le tenemos que pasar?

- En el modo en el que estamos (ReadOnly, Edit, Append).
- Un callback para que el padre cambia a modo Append.
- Un callback para cancelar y que el padre cambie a modo ReadOnly.
- Un callback para notificar que se ha creado un nuevo TODO.

Vamos a definir la firma de este componente:

_./src/modules/tasks/pods/task-collection/components/task-append.component.tsx_

```tsx
import React from "react";
import { Mode, TaskVm } from "../task-collection.vm";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TaskVm) => void;
}

export const TaskAppendComponent: React.FC<Props> = (props: Props) => {
  const { mode, setAppendMode, onAppend, onCancel } = props;

  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <div>
          <h3>Here goes editing thing...</h3>
          <button onClick={onCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};
```

Para usarlo de una manera más sencilla vamos a crear un barrel:

_./src/modules/tasks/pods/task-collection/components/index.ts_

```ts
export * from "./task-append.component";
```

Y ahora vamos a usarlo en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
+ import { TaskAppendComponent } from "./components";
```

```diff
  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todoList}>
        {taskCollection.map((task) => (
          <React.Fragment key={task.id}>
            <div>{task.isDone ? "✅" : "⭕️"}</div>
            <div>{task.description}</div>
          </React.Fragment>
        ))}
      </div>
+     <TaskAppendComponent/>
    </div>
  );
```

Por supuesto, nos sale en rojo, tenemos que pasarle propiedades:

- El modo lo tenemos.
- El AppendModel, Cancel y Append, no los tenemos, vamos a implementarlos:

```diff
  <TaskAppendComponent
+        mode={mode}
+        setAppendMode={() => setMode("Append")}
+        onCancel={() => setMode("Readonly")}
+        onAppend={(item) => { console.log("TODO... save", item)}}
  />
```

Vamos a ver que tal se porta esto (ocultar mostrar el area de inserción):

```bash
npm run dev
```

Si pinchamos en el botón cambiamos de modo read only a modo append.

Ahora vamos a implementar el formulario de edición, queremos hacer uno genérico para edición e inserción, ¿Qué debemos de pasarle?

- Un Item (sea uno existente o uno nuevo para insertar).
- Un callback para guardar cambios (el padre es responsable de guardar).
- Un callback para cancelar cambios (el padre decide a que modo va).

_./components/task-item-edit.component.tsx_

```ts
import React from "react";
import { TaskVm } from "../task-collection.vm";

interface Props {
  item: TaskVm;
  onSave: (item: TaskVm) => void;
  onCancel: () => void;
}

export const TaskItemEdit: React.FC<Props> = (props: Props) => {
  const { item, onSave, onCancel } = props;
  const [editItem, setEditItem] = React.useState({ ...item });

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={editItem.isDone}
          onChange={(e) =>
            setEditItem({ ...editItem, isDone: e.target.checked })
          }
        />
        Done
      </label>
      <input
        type="text"
        value={editItem.description}
        onChange={(e) =>
          setEditItem({ ...editItem, description: e.target.value })
        }
      />
      <div>
        <button onClick={() => onSave(editItem)}>Save</button>
        <button onClick={() => onCancel()}>Cancel</button>
      </div>
    </>
  );
};
```

Para el modo append, nos hace falta un método en el VM que cree un tarea en blanco:

_./src/modules/tasks/pods/task-collection/task-collection.vm.ts_

```diff
export type Mode = "Readonly" | "Append" | "Edit";

export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}

+ export const createEmptyTask = (): TaskVm => ({
+   id: 0,
+   description: "",
+   isDone: false,
+ });
```

Vamos a usar esto en nuestro _task-append.component.tsx_:

_./src/modules/tasks/pods/task-collection/components/task-append.component.tsx_

```diff
import React from "react";
- import { Mode, TaskVm } from "../task-collection.vm";
+ import { Mode, TaskVm, createEmptyTask } from "../task-collection.vm";
+ import { TaskItemEdit } from "./task-item-edit.component";
```

```diff
  ) : (
    <div>
-      <h3>Here goes editing thing...</h3>
-      <button onClick={onCancel}>Cancel</button>
+        {/* Recordar onAppend en destructuring props*/}
+         <TaskItemEdit
+           item={createEmptyTodoItem()}
+           onSave={onAppend}
+           onCancel={onCancel}
+         />
    </div>
  )}
```

Podemos probar que funciona (llega a sacar un mensaje por consola)

```bash
npm run dev
```

Ya lo tenemos todo enlazado, vamos ahora a implementar la api que va a conectar para guardar d verdad los datos:

Primero el _post_ con _axios_:

_./src/modules/tasks/pods/task-collection/api/api.ts_

```diff
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

+ export const insertTask = async (task: TaskModel): Promise<TaskModel> => {
+   const { data } = await axios.post<TaskModel>(
+     `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`,
+     task
+   );
+
+  return data;
+ };
```

Pero lo que tenemos es un _viewModel_ así que vamos a implementar, un mapper para pasar de _viewModel_ a _apiModel_ y crear el método en el repositorio:

_./src/modules/tasks/pods/task-collection/task-collection.mapper.ts_

```diff
import * as apiModel from "./api/api.model";
import * as vm from "./task-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TaskVm => ({
  ...task,
});

+ export const mapTaskFromVmToApi = (task: vm.TaskVm): apiModel.TaskModel => ({
+   ...task,
+ });
```

Y creamos la entrada en el repositorio:

_./src/modules/tasks/pods/task-collection/task-collection.repository.ts_

```diff
import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm,
+        mapTaskFromVmToApi
} from "./task-collection.mapper";
import * as vm from "./task-collection.vm";
import { getTaskCollection as getTaskCollecionApi,
+        insertTask as insertTaskApi
 } from "./api/api";

export const getTaskCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};

+ export const insertTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
+   const apiTask = mapTaskFromVmToApi(task);
+   const insertedTask = await insertTaskApi(apiTask);
+   return mapTaskFromApiToVm(insertedTask);
+ };
```

Toca ahora implementar la mutación con _React Query_, de momento lo hacemos en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent } from "./components";
+ import { useMutation } from "@tanstack/react-query";
+ import { insertTask } from "./task-collection.repository";
```

```diff
export const TaskCollectionPod: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
+ const { mutate: insertTaskMutation } = useMutation({
+    mutationFn: insertTask,
+  });

+ const handleAppend = (item: TaskVm) => {
+   insertTaskMutation(item);
+   setMode("Readonly");
+ };
```

Y lo enlazamos en el JSX

```diff
      <TaskAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
-        onAppend={(item) => {
-          console.log("TODO... save", item);
-        }}
+        onAppend={handleAppend}
      />
```

Con esto grabamos, pero... ¿No se ve en la lista? Qué está pasando?

Pues que como no perdemos foco, y no se recarga el componente, se queda con la query de caché, tendrámos que esperar unos minutos para que se recargara ¿Qué podemos hacer? Pues _useMutation_ tiene un segundo parámetro en el que podemos indicarle un callback al que llamar cuando se haya grabado, y ahí podemos indicarle que query queremos que se recargue:

_Nos toca antes del refactor importar queryClient y querykeys_

```diff
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
+    onSuccess: () => {
+      queryClient.invalidateQueries({
+        queryKey: queryKeys.all(),
+      });
+    },
```

Vamos a probar que funciona:

```bash
npm run dev
```

Vamos a hacer un refactor, metemos la mutación en un hook, aquí podemos elegir:

- Si lo metemos en el _use-task-collection-query.hook.ts_.
- O si creamos un nuevo fichero, se podría llamar _use-task-mutation.hook.ts_.
