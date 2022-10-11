# 00 Rendering condicional

## Resumen

Un escenario muy común que nos encontramos cuando desarrollamos una aplicación
es que ciertos componentes se tienen que mostrar o no dependiendo de ciertas
condiciones.

Esto de primeras puede resultar muy obvio, puede usar el operador and _&&_,
indicar la condición y después el markup que se tendría que mostrar si
la condición es true.

Está "facilidad" nos puede llevar a grandes quebradores de cabeza:

- En algunos casos la condición puede cortocircuitar de forma errónea.
- En otros casos nuestro código puede ser muy difícil de leer y mantener,
  sobre todo cuando tienes que anidar varios condicionales.

En estos ejemplos vamos a empezar a trabajar con esto e ir
sugiriendo buenas prácticas.

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos empezar por un clásico:
  - Necesito cargar los datos de servidor de una ficha de cliente.
  - De primeras no tengo ficha de cliente.
  - En el useState inicializo el cliente a null.

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

- Vamos a simular una api para cargar los datos del clinete:

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

- De momento el componente va a mostrar el nombre de esa persona.

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

  return (
    <div>
      <h1>Client</h1>
      <h2>{client.name}</h2>
    </div>
  );
};
```

- Añadimos un barrel:

_./src/components/client/index.ts_

```ts
export * from "./client.component";
```

- Vamos a añadirlo al _app.tsx_

```diff
import React from "react";
+ import { ClientComponent } from "./components/client";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <ClientComponent />;
};
```

};

````

- Si ejecutamos este código ¿Qué va a pasar?

Que nos pega un castañazo, ya que existe un momento en el que
_client_ vale null y _client.name_ no existe.

¿Qué podemos hacer para arreglar algo así?

- Una opción es usar el operador _&&_.

_./src/components/client/client.component.tsx_

```diff
- <h2>{client.name}</h2>
+ <h2>{client && client.name}</h2>
````

¿Qué estamos haciendo aquí?

- En cuanto introducimos las llaves en JSX estamos indicando que
  vamos a ejecutar código javascript.
- Lo que hacemos es ver que valor tiene client, si es false, null,
  undefined o cero va a valer false, si no true.
- Con lo que cuando llega al _&&_ (and) si evalua a false se cortocircuita y no ejecuta el resto del código, si no si ejecuta
  el código que va después del _&&_.

Incluso podríamos subirlo a nivel global

_./src/components/client/client.component.tsx_

```diff
return (
+ <>
+ { client &&
    <div>
      <h1>Client</h1>
-      <h2>{client && client.name}</h2>
+      <h2>{client.name}</h2>
    </div>
+ }
+ </>
  );
```

Aquí estamos metiendo complejidad al markup, y en algunos escenarios podemos estar creando bugs (ya veremos más adelante).

- Otra opción es usar el operador _?_.

_./src/components/client/client.component.tsx_

```diff
- <h2>{client && client.name}</h2>
+ <h2>{client?.name}</h2>
```

Esta solución puede ser curiosa para un solo campo, aún así estamos
devolviendo un null por aqui...

- Otra opción es usar el operador _??_.

_./src/components/client/client.component.tsx_

```diff
- <h2>{client?.name}</h2>
+ <h2>{client?.name ?? "No client"}</h2>
```

Así en caso de que no venga informado el cliente, se mostrará el texto
"No client".

El problema de esto es ir campo a campo, metemos mucho ruido en nuestro TSX.

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
      <h2>{client.name}</h2>
    </div>
  );
};
````

De esta manera no estamos manchando el flujo principal de nuestro TSX, aunque queda
un poco raro el componente.

- Una opción que me personalmente me gusta más es la de usar siempre valores seguros,
  es decir, en vez de inicializar a _null_ utilizar un factory para mostrar un valor
  por defecto bien formado, esto es:
  - En el caso de una instancia, la misma informada con datos dummy.
  - En el caso de un array, un array vacío.

Así pues, añadimos el factory a nuestro modelo:

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
```
