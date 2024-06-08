# 01 Rendering condicional

## Resumen

Un escenario muy común que nos encontramos cuando desarrollamos una aplicación es que ciertos componentes se tienen que mostrar o no dependiendo de ciertas condiciones.

Esto de primeras puede resultar muy obvio, puedes usar el operador and _&&_, indicar la condición y después el _markup_ que se tendría que mostrar si la condición es _true_.

Está "_facilidad_" nos puede llevar a grandes quebradores de cabeza:

- En algunos casos la condición puede cortocircuitar de forma errónea.

- En otros casos nuestro código puede ser muy difícil de leer y mantener, sobre todo cuando tienes que anidar varios condicionales.

En estos ejemplos vamos a empezar a trabajar con esto e ir sugiriendo buenas prácticas.

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Lo copiamos, y hacemos un _npm install_

```bash
npm install
```

- Vamos empezar por un clásico:
  - Necesito cargar los datos de servidor de una ficha de cliente.
  - De primeras no tengo ficha de cliente.
  - En el _useState_ inicializo el cliente a _null_.

En cuanto ejecuto... ¿Qué va a pasar?

Montemos el ejemplo y veamos que pasa:

- Vamos a crear nuestro componente para editar un cliente.

_./src/components/client/model.ts_

```ts
export interface Client {
  name: string;
  lastnameA: string;
  lastnameB: string;
  spanishNationality: boolean;
  Residence: boolean;
  companyDocument: boolean;
  nif: string;
  cif: string;
  nie: string;
  other: string;
}
```

- Vamos a simular una _api_ para cargar los datos del cliente:

_./src/components/client.api.ts_

```ts
import { Client } from "./model";

export const loadClient = (): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "John",
        lastnameA: "Doe",
        lastnameB: "Doe",
        spanishNationality: true,
        Residence: false,
        companyDocument: false,
        nif: "12345678Z",
        cif: "",
        nie: "",
        other: "",
      });
    }, 1000);
  });
};
```

- De momento el componente va a mostrar el nombre de esa persona, aquí el modo estricto nos es de gran ayuda.

_./src/components/client/client.component.tsx_

```tsx
import React, { useState } from "react";
import { Client } from "./model";
import { loadClient } from "./client.api";

export const ClientComponent = () => {
  const [client, setClient] = useState<Client | null>(null);

  React.useEffect(() => {
    loadClient().then((client) => setClient(client));
  }, []);

  return (
    <div>
      <h1>Client</h1>
      <h2>{client.name}</h2>
    </div>
  );
};
```

- Añadimos un _barrel_:

_./src/components/client/index.ts_

```ts
export * from "./client.component";
```

- Vamos a añadirlo al _App.tsx_

```diff
+ import { ClientComponent } from "./components/client/client.component";
import './App.css'


export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <ClientComponent />;
};
```

- Si ejecutamos este código ¿Qué va a pasar?

Que nos pega un castañazo, ya que existe un momento en el que _client_ vale null y _client.name_ no existe.

¿Qué podemos hacer para arreglar algo así?

- Una opción es usar el operador _&&_.

_./src/components/client/client.component.tsx_

```diff
- <h2>{client.name}</h2>
+ <h2>{client && client.name}</h2>
```

¿Qué estamos haciendo aquí?

- En cuanto introducimos las llaves en _JSX_ estamos indicando que vamos a ejecutar código _javascript_.

- Lo que hacemos es ver qué valor tiene _client_, si es _false_, _null_, _undefined_ o cero va a valer _false_, si no _true_.

- Con lo que cuando llega al _&& (and)_ si evalúa a false se cortocircuita y no ejecuta el resto del código, si no si ejecuta el código que va después del _&&_.

Incluso podríamos subirlo a nivel global

_./src/components/client/client.component.tsx_

```diff
return (
+ <>
+ { client && (
    <div>
      <h1>Client</h1>
-      <h2>{client && client.name}</h2>
+      <h2>{client.name}</h2>
    </div>
+ )}
+ </>
  );
```

Aquí estamos metiendo complejidad al _markup_, y en algunos escenarios podemos estar creando _bugs_ (ya veremos más adelante).

- Otra opción es usar el operador _?_.

_./src/components/client/client.component.tsx_

```diff
return (
- <>
- { client &&
    <div>
      <h1>Client</h1>
+     <h2>{client?.name}</h2>
    </div>
- }
- </>
  );
```

Esta solución puede ser curiosa para un solo campo, aun así estamos devolviendo un _null_ por aquí...

- Otra más opción es añadir el operador _??_.

_./src/components/client/client.component.tsx_

```diff
- <h2>{client?.name}</h2>
+ <h2>{client?.name ?? "No client"}</h2>
```

Así en caso de que no venga informado el cliente, se mostrará el texto "_No client_".

El problema de esto es ir campo a campo, metemos mucho ruido en nuestro _TSX_.

- Seguimos evaluando opciones, ... A fin de cuentas si tenemos una función, podemos tener más de _return_

_./src/components/client/client.component.tsx_

````diff
_./src/components/client/client.component.tsx_

```tsx
import React, { useState } from "react";
import { Client } from "./model";
import { loadClient } from "./client.api";

export const ClientComponent = () => {
  const [client, setClient] = useState<Client>(null);

  React.useEffect(() => {
    loadClient().then((client) => setClient(client));
  }, []);

+ if(!client) {
+   return (null);
+ }

  return (
    <div>
      <h1>Client</h1>
-      <h2>{client?.name ?? "No client"}</h2>
+      <h2>{client.name}</h2>
    </div>
  );
};
````

Tambíen podríamos añadir un indicador de carga:

```diff
 if(!client) {
-   return (null);
+   return (<h1>Loading...</h1>);
 }
```

De esta manera no estamos manchando el flujo principal de nuestro TSX, aunque queda un poco raro el componente.

- Una opción que personalmente me gusta más es la de usar siempre valores seguros,es decir, en vez de inicializar a _null_ utilizar un _factory_ para mostrar un valor por defecto bien formado, esto es:
  - En el caso de una instancia, la misma informada con datos _dummy_.
  - En el caso de un _array_, un _array_ vacío.

Así pues, añadimos el _factory_ a nuestro modelo:

_./src/components/client/model.ts_

```diff
interface Client {
  name: string;
  lastnameA: string;
  lastnameB: string;
  spanishNationality: boolean;
  Residence: boolean;
  companyDocument: boolean;
  nif: string;
  cif: string;
  nie: string;
  other: string;
}

+ export const createEmptyClient = (): Client => ({
+  name: "",
+  lastnameA: "",
+  lastnameB: "",
+  spanishNationality: false,
+  Residence: false,
+  companyDocument: false,
+  nif: "",
+  cif: "",
+  nie: "",
+  other: "",
+ });
```

Lo usamos en la inicialización de _useState_

_./src/components/client/client.component.tsx_

```diff
import React, { useState } from "react";
import { Client } from "./model";
import { loadClient } from "./client.api";
+ import { createEmptyClient } from "./model";

export const ClientComponent = () => {
-  const [client, setClient] = useState<Client>(null);
+  const [client, setClient] = useState<Client>(createEmptyClient());

  React.useEffect(() => {
    loadClient().then((client) => setClient(client));
  }, []);

-  if (!client) {
-    return <h1>Loading...</h1>;
-  }

  return (
```

y si queremos añadirle una optimización más:

```ts
export const ClientComponent = () => {
  const [client, setClient] = useState<Client>(() => createEmptyClient());
```
