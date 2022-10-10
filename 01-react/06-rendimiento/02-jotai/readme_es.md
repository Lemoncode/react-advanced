# 02 Context y Jotai

## Resumen

En React es muy común utilizar el contexto para todo lo que sean datos comunes o para compartir datos entre componentes.

Hasta aquí muy bien, pero si nos paramos a evaluar rendimiento, nos podemos encontrar casos en los que podemos tener problemas.

Vamos a aprender que implicaciones tiene usar el contexto, y como en los casos en lo que
nos pueda dar problemas como usar alternativas como de manejo de estado global como
_Jotai_

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Creamos una entidad para almacenar nombre y apellidos.

_./src/core/model.ts_

```ts
export interface Fullname {
  name: string;
  lastname: string;
}

export const createEmptyFullname = (): Fullname => ({
  name: "",
  lastname: "",
});
```

- Vamos a crear un contexto para almacenar un nombre y apellidos.

_./src/core/fullname.context.ts_

```ts
import React from "react";
import { Fullname, createEmptyFullname } from "./model";

export interface FullnameContextVm extends Fullname {
  setName: (name: string) => void;
  setLastname: (lastname: string) => void;
}

const notInitialized = "not initialized";

export const FullnameContext = React.createContext<FullnameContextVm>({
  name: notInitialized,
  lastname: notInitialized,
  setName: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
  setLastname: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});
```

_./src/core/fullname.provider.tsx_

```tsx
import React from "react";
import { Fullname, createEmptyFullname } from "./model";
import { FullnameContext } from "./fullname.context";

interface Props {
  children: React.ReactNode;
}

export const FullnameProvider: React.FC<Props> = ({ children }) => {
  const [fullname, setFullname] = React.useState<Fullname>(
    createEmptyFullname()
  );

  const setName = (name: string) => {
    setFullname((prev) => ({ ...prev, name }));
  };

  const setLastname = (lastname: string) => {
    setFullname((prev) => ({ ...prev, lastname }));
  };

  return (
    <FullnameContext.Provider
      value={{
        name: fullname.name,
        lastname: fullname.lastname,
        setName,
        setLastname,
      }}
    >
      {children}
    </FullnameContext.Provider>
  );
};

export const useFullnameContext = () => {
  const context = React.useContext(FullnameContext);
  if (context === undefined) {
    throw new Error(
      "useFullnameContext must be used within a FullnameProvider"
    );
  }
  return context;
};
```

- Añadimos un barrel para que nuestros imports sean más sencillos.

_./src/core/index.ts_

```ts
export * from "./fullname.provider";
```

- Vamos a darle uso a este contexto a nivel de app:

_./src/app.tsx_

```diff
import React from "react";
+ import { FullnameProvider } from "./core";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return (
+    <FullnameProvider>
+      <h1>Hello React !!</h1>
+    </FullnameProvider>
+  );
};
```

- Ahora vamos a pasar de usar props y usar el contexto para alimentar a un
  componente que llamaremos _display-name_ y otro que llamaremos _edit-lastname_

_./src/components/display-name.component.tsx_

```tsx
import React from "react";
import { useFullnameContext } from "../core";

export const DisplayNameComponent: React.FC = () => {
  const { name } = useFullnameContext();

  return (
    <div>
      <h2>Display Name</h2>
      <h3>{name}</h3>
    </div>
  );
};
```

_./src/components/edit-name.component.tsx_

```tsx
import React from "react";
import { useFullnameContext } from "../core";

export const EditNameComponent: React.FC = () => {
  const { name, setName } = useFullnameContext();

  return (
    <div>
      <h2>Edit Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};
```

Y lo mismo para el apellido:

_./src/components/display-lastname.component.tsx_

```tsx
import React from "react";
import { useFullnameContext } from "../core";

export const DisplayLastnameComponent: React.FC = () => {
  const { lastname } = useFullnameContext();

  return (
    <div>
      <h2>Display Lastname</h2>
      <h3>{lastname}</h3>
    </div>
  );
};
```

_./src/components/edit-lastname.component.tsx_

```tsx
import React from "react";
import { useFullnameContext } from "../core";

export const EditLastnameComponent: React.FC = () => {
  const { lastname, setLastname } = useFullnameContext();

  return (
    <div>
      <h2>Edit Lastname</h2>
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
    </div>
  );
};
```

- Vamos a crear un barrel:

_./src/components/index.ts_

```ts
export * from "./display-name.component";
export * from "./edit-name.component";
export * from "./display-lastname.component";
export * from "./edit-lastname.component";
```

- Vamos añadirlo todo a la App:

```diff
import React from "react";
import { FullnameProvider } from "./core";
+ import {
+  DisplayNameComponent,
+  EditNameComponent,
+  DisplayLastnameComponent,
+  EditLastnameComponent,
+ } from "./components";

export const App = () => {
  return (
    <FullnameProvider>
-      <h1>Hello React !!</h1>
+      <DisplayNameComponent/>
+      <EditNameComponent/>
+      <DisplayLastnameComponent/>
+      <EditLastnameComponent/>
    </FullnameProvider>
  );
};
```

- Probamos y vemos que funciona como esperabamos

```bash
npm start
```

- Vamos a poner un console.log en cada componente para ver si se tira el render.

_./src/components/display-name.component.tsx_

```diff
export const DisplayNameComponent: React.FC = () => {
  const { name } = useFullnameContext();

+ console.log("1111 - DisplayNameComponent render");

  return (
    <div>
      <h2>Display Name</h2>
      <h3>{name}</h3>
    </div>
  );
```

_./src/components/edit-name.component.tsx_

```diff
  const { name, setName } = useFullnameContext();

+ console.log("22222 - EditNameComponent render");

  return (
    <div>
      <h2>Edit Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
```

_./src/components/display-lastname.component.tsx_

```diff
export const DisplayLastnameComponent: React.FC = () => {
  const { lastname } = useFullnameContext();

+ console.log("33333 - DisplayLastnameComponent render");
```

_./src/components/edit-lastname.component.tsx_

```diff
  const { lastname, setLastname } = useFullnameContext();

+ console.log("4444 - EditLastnameComponent render");
```

- Si te fijas si cambio el nombre, se tira un render del apellido.

¿Qué problema tenemos con esto? Que en una aplicación real un contexto puede
tener un modelo complejo (por ejemplo el theme de una aplicación) y tocando
un sóla propiedad haría que todos los componentes que usen ese context
se repintaran... podemos plantear parches:

- Mover más abajo el componente que pinta y usar React.memo.
- Partir el contexto en varios, pero la api de context es un poco
  verbosa...

Vamos a por una solución curiosa, vamos a usar _Jotai_ y romper el
contexto en _atomos_

- Vamos a instalar la librería

```bash
npm i jotai
```

- Vamos a borrar los ficheros de contexto.

- fullname.context.ts
- fullname.provider.ts

Y vamos a crear un fichero que llamaremos _atoms_, ahí
añadiremos los atoms de nombre y apellidos.

_./src/core/atoms.ts_

```ts
import { atom } from "jotai";

export const nameAtom = atom("John");
export const lastnameAtom = atom("Doe");
```

Actualizamos el barrel

_/src/core/index.ts_

```diff
- export * from "./fullname.provider";
+ export * from "./atoms";
```

- Vamos a hacer limpia en el _app.tsx_

_./src/app.tsx_

```diff
import React from "react";
- import { FullnameProvider } from "./core";
import {
  DisplayNameComponent,
  EditNameComponent,
  DisplayLastnameComponent,
  EditLastnameComponent,
} from "./components";

export const App = () => {

  return (
-    <FullnameProvider>
+    <>
      <DisplayNameComponent />
      <EditNameComponent />
      <DisplayLastnameComponent />
      <EditLastnameComponent />
-    </FullnameProvider>
+    </>
  );
};
```

Y vamos a hacer uso de los _atoms_

_./src/components/display-name.componet.tsx_

```diff
import React from "react";
- import { useFullnameContext } from "../core";
+ import { useAtom } from "jotai";
+ import { nameAtom } from "../core";

export const DisplayNameComponent: React.FC = () => {
-  const { name } = useFullnameContext();
+  const [name] = useAtom(nameAtom);

  console.log("1111 - DisplayNameComponent render");

  return (
    <div>
      <h2>Display Name</h2>
      <h3>{name}</h3>
    </div>
  );
};

```

_./src/components/edit-name.component.tsx_

```diff
import React from "react";
- import { useFullnameContext } from "../core";
+ import { useAtom } from "jotai";
+ import { nameAtom } from "../core";

export const EditNameComponent: React.FC = () => {
-  const { name, setName } = useFullnameContext();
+  const [name, setName] = useAtom(nameAtom);

  console.log("22222 - EditNameComponent render");

  return (
    <div>
      <h2>Edit Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};
```

_./src/components/display-lastname.component.tsx_

```diff
import React from "react";
- import { useFullnameContext } from "../core";
+ import { useAtom } from 'jotai';
+ import { lastnameAtom } from "../core";

export const DisplayLastnameComponent: React.FC = () => {
-  const { lastname } = useFullnameContext();
+  const [lastname] = useAtom(lastnameAtom);

  console.log("33333 - DisplayLastnameComponent render");

  return (
    <div>
      <h2>Display Lastname</h2>
      <h3>{lastname}</h3>
    </div>
  );
};
```

_./src/components/edit-lastname.component.tsx_

```diff
import React from "react";
- import { useFullnameContext } from "../core";
+ import { useAtom } from 'jotai';
+ import { lastnameAtom } from "../core";


export const EditLastnameComponent: React.FC = () => {
-  const { lastname, setLastname } = useFullnameContext();
+  const [lastname, setLastname] = useAtom(lastnameAtom);

  console.log("4444 - EditLastnameComponent render");

  return (
    <div>
      <h2>Edit Lastname</h2>
      <input
        type="text"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
    </div>
  );
};
```

- Si ahora probamos podemos ver que sólo se repinta el componente que
  toca.

```bash
npm start
```

- ¿Y si nos hiciera falta un componente que mostrara el nombre y el a
  apellido? Tendríamos que tirar de los dos ¿Atomos? Podemos... pero
  mejor tirar de un estado derivado:

_./src/core/atoms.ts_

```diff

```