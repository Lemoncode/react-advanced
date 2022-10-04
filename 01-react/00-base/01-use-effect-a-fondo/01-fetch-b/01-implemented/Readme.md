# Ejemplo

Vamos a seguir practicando con React Query, esta vez vamos a:

- Trabajar con mutaciones (post / update).
- Invalidar consultas.

Vamos a crear una aplicación que va a manejar una lista de ToDos.

Después como ejercicio trabajaremos con una lista de la compra.

# Pasos

- Vamos a levantar el mock de backend (creado con JSON Server).

```bash
cd back
```

```bash
npm install
```

Y ha dejarlo arrancado

```bash
npm start
```

Accedemos desde el navegador a _localhost:3000_ y vemos que podemos navegar a un listado de TODOs.

- Dejamos ese terminal abierto y creamos un nuevo terminal, esta vez toca trabajar con el front, si estamos
  en el raiz hacemos un cd front y luego arrancamos:

```bash
cd front
```

```bash
npm install
```

```bash
npm start
```

- Aquí vemos una aplicación sencilla con dos ventanas.

- Vamos a arrancarnos con la página de TODOs.

- Lo primero que vamos a hacer es definir el modelo para los
  TODOs:

_./src/pages/todo/todo.model.ts_

```ts
export interface TodoItem {
  id: number;
  description: string;
  isDone: boolean;
}
```

- Si siguieramos programación progresiva, ahora crearíamos una lista
  mock harcodeada y nos pondríamos con el componente para después
  conectar con la API real, en este caso vamos a tirar por crear la
  API para poder centrarnos en React Query.

- Vamos a definir la API:

_./src/pages/todo/todo.api.ts_

```ts
import { TodoItem } from "./todo.model";

export const getTodoList = async (): Promise<TodoItem[]> => {
  const response = await fetch(`http://localhost:3000/todos`);
  const data = await response.json();
  return data;
};
```

- Vamos a por la parte de componente y vamos a consumir esa API,
  para ello usaremos React Query.

```bash
npm install @tanstack/react-query
```

Toca instanciar el provider a nivel de App:

Creamos el query client:

_./src/core/query/query-client.ts_

```ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

_./src/app.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
+ import { QueryClientProvider } from "@tanstack/react-query";
+ import { queryClient } from "./core/query/query-client";

export const App = () => {
  return (
+    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </HashRouter>
+    </QueryClientProvider>
  );
  );
};
```

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
+ import { useQuery } from "@tanstack/react-query";
+ import { getTodoList } from './todo.api';


export const TodoPage: React.FC = () => {
+
+  const { data } = useQuery(["todoList"], () =>
+    getTodoList()
+  );
+
  return (
    <>
      <h1>Todo Page</h1>
+      <ul>
+        {data?.map((todo) => (
+          <li key={todo.id}>
+            {todo.description} - {todo.isDone ? "🔘" : "⚫️"}
+          </li>
+        ))}
+      </ul>
      <Link to="/list">To List</Link>
    </>
  );
};
```

Vamos ver que tal funciona esto:

```bash
npm start
```

- Tenemos algo básico cargando, vamos a simular que vamos a trabajar
  en un proyecto más grande, es hora de hacer refactor dela consultas:

Vamos a crear query keys para el area de TODOs:

_./src/pages/todo/todo-key-queries.ts_

```ts
export const todoKeys = {
  all: ["todo"] as const,
  todoList: () => [...todoKeys.all, "todoList"] as const,
};
```

Y vamos a crear un fichero con hooks que hagan de wrapper de
las consultas.

_./src/pages/todo/todo-query.ts_

```ts
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
import { TodoItem } from "./todo.model";
import { todoKeys } from "./todo-key-queries";

export const useTodoListQuery = () => {
  return useQuery(todoKeys.todoList, () => getTodoList());
};
```

Vamos a darle uso en la página:

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { useQuery } from "@tanstack/react-query";
- import { getTodoList } from "./todo.api";
+ import {useTodoListQuery} from './todo-query';

export const TodoPage: React.FC = () => {
-  const { data } = useQuery(["todoList"], () => getTodoList());
+  const { data } = useTodoListQuery();


  return (
```

- Le damos algo de estilado a la lista de TODOs:

  - Vamos a tener un grid con tres columnas:
    - Estado de la tarea.
    - Nombre de la tarea.
    - Paleta de comandos (editar, borrar, o si ya estas
      editando grabar / cancelar).

_./src/pages/todo/todo.page.css_

```css
.todo-list {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 1rem;
  margin: 1rem;
}
```

- Aplicamos el estilo a la lista:

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
+ import classes from './todo.page.css';

export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());

  return (
    <>
      <h1>Todo Page</h1>
-      <ul>
+      <div className={classes.todoList}>
        {data?.map((todo) => (
+          <React.Fragment key={todo.id}>
+            <div>{todo.isDone ? "✅" : "⭕️"}</div>
+            <div>{todo.description}</div>
+            <div>Command area</div>
+          </React.Fragment>
        ))}
-          <li key={todo.id}>
-            {todo.isDone ? "✅" : "⭕️"} {todo.description}
-          </li>
        ))}
-      </ul>
+      </div>
      <Link to="/list">To List</Link>
    </>
  );
};
```

- Como vamos a tener modo edición vamos a encapsular ya el modo
  display.

_./src/pages/todo/components/todo-item-display.component.tsx_

```tsx
import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
}

export const TodoItemDisplay: React.FC<Props> = (props) => {
  const { item } = props;

  return (
    <>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <div>Command area</div>
    </>
  );
};
```

- Creamos un barrel:

_./src/pages/todo/components/index.ts_

```ts
export * from "./todo-item-display.component";
```

Reemplazamos en página principal

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
import classes from "./todo.page.css";
+ import {TodoItemDisplay} from './components';
```

_./src/pages/todo/todo.page.tsx_

```diff
  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
-          <React.Fragment key={todo.Id}>
-            <div>{todo.isDone ? "✅" : "⭕️"}</div>
-            <div>{todo.description}</div>
-            <div>Command area</div>
-          </React.Fragment>
+          <TodoItemDisplay key={todo.id} item={todo}>
        ))}
      </div>
```

- Para saber si un TODO esta en edición (sólo dejaremos que
  uno esté en edición a la vez), podemos o bien usar un flag o
  tener en cada TODO un flag para saber si está en modo edición.

Vamos a almacenar en una variable el Id del TODO en edición,
tendremos los siguientes valores:

- -1 -> No hay ningún TODO en edición.
- 0 -> Estamos insertando un nuevo TODO.
- > 0 -> Estamos editando un TODO que ya existe.

_./src/pages/todo/todo.page.tsx_

```diff
import { TodoItemDisplay } from "./components";

+ const ReadOnlyMode = -1;
+ const AppendMode = 0;

export const TodoPage: React.FC = () => {
```

- Vamos a mostrar componente de edición o estado según
  lo que toque.

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());
+ const [editingId, setEditingId] = React.useState(ReadOnlyMode);

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
+         (todo.id !== editingId) ?
+           <TodoItemDisplay key={todo.id} item={todo}/>
+        :
+            <>
+              <h6>Edit Mode...</h6>
+              <h6>Todo...</h6>
+              <h6>Todo...</h6>
+            </>
        ))}
      </div>
      <Link to="/list">To List</Link>
    </>
  );
};
```

Y vamos a añadir el botón para entrar en edit mode:

_./src/pages/todo/components/todo-item-display.component.tsx_

```diff
import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
+ onEdit: (id: number) => void;
}

export const TodoItemDisplay: React.FC<Props> = (Props: props) => {
- const { item } = props;
+ const {item, onEdit} = props;

  return (
    <React.Fragment key={item.id}>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
-      <div>Command area</div>
+      <div><button onClick={() => onEdit(item.id)}>Edit</button></div>
    </React.Fragment>
  );
};
```

Y en la página principal:

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());
  const [editingId, setEditingId] = React.useState(ReadOnlyMode);

+ const handleEnterEditMode = (id: number) => {
+   setEditingId(id);
+ }

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) =>
          todo.id !== editingId ? (
-            <TodoItemDisplay key={todo.id} item={todo}/>
+            <TodoItemDisplay key={todo.id} item={todo} onEdit={handleEnterEditMode}/>
```

- Vamos a crear el component de edición:

_./src/pages/todo/components/todo-item-edit.component.tsx_

```tsx
import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
  onSave: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoItemEdit: React.FC<Props> = (props: Props) => {
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

Lo añadimos al barrel

_./src/pages/todo/components/index.ts_

```diff
export * from "./todo-item-display.component";
+ export * from "./todo-item-edit.component";
```

Y en la página principal:

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
import classes from "./todo.page.css";
+ import { TodoItem } from "./todo.model";
- import { TodoItemDisplay } from "./components";
+ import { TodoItemDisplay, TodoItemEdit } from "./components";
```

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());
  const [editingId, setEditingId] = React.useState(ReadOnlyMode);

  const handleEnterEditMode = (id: number) => {
    setEditingId(id);
  };

+ const handleSave = (item: TodoItem) => {
+   console.log("Save", item);
+   setEditingId(ReadOnlyMode);
+ };

+ const handleCancel = () => {
+   setEditingId(ReadOnlyMode);
+ };

  return (
```

_./src/pages/todo/todo.page.tsx_

```diff
  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) =>
          todo.id !== editingId ? (
            <TodoItemDisplay
              key={todo.id}
              item={todo}
              onEdit={handleEnterEditMode}
            />
          ) : (
-            <>
-              <h6>Edit Mode...</h6>
-              <h6>Todo...</h6>
-              <h6>Todo...</h6>
-            </>
+           <TodoItemEdit key={todo.id} item={todo} onSave={handleSave} onCancel={handleCancel}/>
          )
          )
        )}
      </div>
```

Vamos ahora a la parte interesante, queremos grabar los cambios en el servidor.

- Definimos la entrada en la API:

```diff
import { TodoItem } from "./todo.model";

export const getTodoList = async (): Promise<TodoItem[]> => {
  const response = await fetch(`http://localhost:3000/todos`);
  const data = await response.json();
  return data;
};

+ export const updateTodoItem = async (item: TodoItem): Promise<TodoItem> => {
+ const response = await fetch(`http://localhost:3000/todos/${item.id}`, {
+   method: "PUT",
+   headers: {
+     "Content-Type": "application/json",
+   },
+   body: JSON.stringify(item),
+ });
+
+ const data = await response.json();
+ return data;
+ };
```

- ¿Y qué hacemos con React Query? En este caso nos ofrece
  _mutations_ esto nos permite lanzar una actualización, tener
  tracking de la misma (lo puedo incrustar en el JSX) y ver que
  hacer tanto si tiene éxito como si no, aquí vamos a por el caso
  "feliz" y cuando se actualize vamos a relanzar la consulta de
  lista de TODos para asegurarnos que está todo al día.

_./src/pages/todo/todo-query.ts_

```diff
- import { useQuery } from "@tanstack/react-query";
+ import { useQuery, useMutation } from "@tanstack/react-query";
- import { getTodoList } from "./todo.api";
+ import { getTodoList, updateTodoItem } from "./todo.api";
import { TodoItem } from "./todo.model";
import { todoKeys } from "./todo-key-queries";

export const useTodoListQuery = () => {
  return useQuery(todoKeys.todoList(), () =>
    getTodoList()
  );
};

+ export const useUpdateTodoItemMutation = (onSuccessFn : () => void) => {
+   return useMutation(updateTodoItem,
+     {
+       onSuccess: () => onSuccessFn()
+     }
+   );
+ };
```

Vamos a darle uso en la handler de la página, en este caso lo que
hacemos es enviar la actualización y pedir que invalide la consulta
con la lista de items.

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
- import { useTodoListQuery } from "./todo-query";
+ import { useTodoListQuery, useUpdateTodoItemMutation } from "./todo-query";
import classes from "./todo.page.css";
import { TodoItem } from "./todo.model";
import { TodoItemDisplay, TodoItemEdit } from "./components";
```

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
+ const handleUpdateSuccess = () => {
+  console.log("Update Success");
+ }

  const { data } = useTodoListQuery();
+ const mutation = useUpdateTodoItemMutation<TodoItem>(null, handleUpdateSuccess);
  const [editingId, setEditingId] = React.useState(ReadOnlyMode);

  const handleEnterEditMode = (id: number) => {
    setEditingId(id);
  };

  const handleSave = (item: TodoItem) => {
-    console.log("Save", item);
+   mutation.mutate(item);
    setEditingId(ReadOnlyMode);
  };
```

- Vamos a pedir ahora que se refresque la lista de TODos cuando
  se actualice un item, para ello vamos a usar el método
  _invalidateQueries_ que nos ofrece React Query.


_./src/pages/todo/todo.page.tsx_
```diff
import React from "react";
import { Link } from "react-router-dom";
+ import { useQueryClient } from "@tanstack/react-query";
+ import { todoKeys } from "./todo-key-queries";
import { useTodoListQuery, useUpdateTodoItemMutation } from "./todo-query";
```

_./src/pages/todo/todo.page.tsx_

```diff
+ const queryClient = useQueryClient();

  const handleUpdateSuccess = () => {
-    console.log("Update Success");
+  queryClient.invalidateQueries(todoKeys.todoList());
  };
```


