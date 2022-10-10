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

- Vamos a crear un barrel:

_./src/components/index.ts_

```ts
export * from "./display-name.component";
export * from "./edit-name.component";
```

- Le damos uso en la App y vemos que todo funciona como esperabamos.

_./src/app.tsx_

```diff
import React from "react";
import { FullnameProvider } from "./core";
+ import {DisplayNameComponent, EditNameComponent} from './components';

export const App = () => {
    return (
        <FullnameProvider>
-          <h1>Hello React !!</h1>
+          <DisplayNameComponent />
+          <EditNameComponent />
        </FullnameProvider>
    );
};
```

- Probamos y vemos que funciona como esperabamos

```bash
npm start
```

- Vamos a crear un estado en _app_ para almacenar el nombre de un pais.

_./src/app.tsx_

```diff

```

- Vamos a añadir el componente _display-country_.

- Vamos a poner un console.log en cada componente para ver si se tira el render.

- Ejecutamos y bien..., modificamos el nombre y tenemos que ¡Display country se hace render!
  ¿Esto puede ser porque el componente no es puro? Vamos añadir un _React.memo_

- Fijate que da igual al ser un dato global se tira el render.

- Si el contexto sólo encapsulara a los componentes de mostrar el nombre
  y apellidos, podemos ver que el render no se dispara en el campo de pais.

- Tirar un rerender en todos los niveles porque un valor del contexto cambie
  no tiene porque impactar negativamente en una aplicación, siempre que esto
  sea esporádico o si la UI no es compleja, pero hay casos en los que puede
  impactar negativamente a la usabilidad de la aplicación.

- ¿Y si yo pudiera tener datos globales reactivos que sólo dispararan actualizaciones
  en los componentes que lo usan? Este concepto es lo que implementa la librería
  _jotai_ que tiene un estilo muy parecido a los _stores_ de _svelte_

- Vamos a instalar jotai

```bash

```

- En Jotai hablamos del concepto de átomo de estado, en nuestro caso vamos a crear
  un átomo para el nombre del usuario.

- Eliminamos el uso del contexto.

- Justo en los componentes que lo vamos a usar nos traemos ese atomo.

- Si ahora comprobamos sólo se ven afectados los componentes de nombre y apellidos.

```bash

```
