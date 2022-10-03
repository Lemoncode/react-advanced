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
  isDone: false;
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
