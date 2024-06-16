# 00 Spread operator en Props

## Resumen

Hay ocasiones en las que se utiliza el operador de propagación en las _props_ de un componente. Esto puede ser peligroso, ya que se nos pueden colar _props_ que no esperábamos y provocarnos problemas.

Veamos un ejemplo.

## Paso a Paso

- Primero copiamos el _00-boiler-plate_ , y hacemos un _npm install_

```bash
npm install
```

- Vamos a crear una carpeta de que llamaremos _demo_.

- Y un componente _name-component.tsx_

_./src/demo/name-component.tsx_

```tsx
import React from "react";

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const NameComponent = (props: Props) => {
  const { name, onChange } = props;
  return (
    <div>
      <h1>{props.name}</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
```

- Otro lo llamaremos _my-form.component.tsx_

_./src/demo/my-form.component.tsx_

```tsx
import React from "react";
import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const MyForm = (props: Props) => {
  const { name, onChange } = props;
  return (
    <div>
      <NameComponent name={name} onChange={onChange} />
    </div>
  );
};
```

- Vamos a crear un componente que llamaremos _home.page.tsx_

_./src/demo/home.page.tsx_

```tsx
import React from "react";

import { MyForm } from "./my-form.component";

export const HomePage = () => {
  const [name, setName] = React.useState("Pepe");

  return (
    <div>
      <MyForm name={name} onChange={setName} />
    </div>
  );
};
```

Y añadir el formulario en el _app.tsx_.

_./src/app.tsx_

```diff
import React from "react";
+ import { HomePage } from "./demo/home.page";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <HomePage />;
};
```

- Vamos a suponer que el componente _name-component_ tiene que estar optimizado para evitar _rerenders_, vamos a _wrappearlo_ con React.memo.

_./src/demo/name-component.component.tsx_

```diff
- export const NameComponent = (props: Props) => {
+ export const NameComponent = React.memo((props: Props) => {
  const {name, onChange} = props;

+ console.log("Name component rerender...");

  return (
    <div>
      <h1>{props.name}</h1>
      <input type="text" value={name} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
 }
+ );
```

- Si te fijas el componente _my-form_ y _name-edit_ reciben las mismas _props_, ¿Podríamos pasárselas directamente?

Si intentamos algo así no funciona ¿Me decís por qué?

_./src/demo/my-form.component.tsx_

```diff
import React from "react";
import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
}

export const MyForm = (props: Props) => {
  const { name, onChange } = props;
  return (
    <div>
-      <NameComponent name={name} onChange={onChange} />
+      <NameComponent props />
    </div>
  );
};
```

Pero si podemos aplanar las _props_:

_./src/demo/my-form.component.tsx_

```diff
    <div>
-      <NameComponent name={name} onChange={onChange} />
+      <NameComponent {...props} />
    </div>
```

Si ejecutamos todo parece que funciona a la perfección, peeerooo.... y si pasa el tiempo y otro desarrollador mete una nueva propiedad en el componente _myform_?

_./src/demo/home.page.tsx_

```diff
export const HomePage = () => {
  const [name, setName] = React.useState("Pepe");
+  const [time, setTime] = React.useState("");

+  React.useEffect(() => {
+    setInterval(() => {
+      setTime(new Date().toLocaleTimeString());
+    }, 1000);
+  }, [])

  return (
    <div>
      <MyForm
        name={name}
        onChange={setName}
+        time={time}
        />
    </div>
  );
};
```

- Actualizamos el _myForm_:

_./src/my-form.component.tsx_

```diff
import React from "react";
import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
+ time : string;
}

export const MyForm = (props: Props) => {
-  const { name, onChange } = props;
+  const { name, onChange, time } = props;

  return (
    <div>
      <NameComponent {...props} />
+      <span>Current time: {time}</span>
    </div>
  );
};
```

¿Todo parece que está bien no? Vamos a ver la consola...

```bash
npm start
```

El _NameComponent_ se renderiza cada segundo ¿Por qué? Pero si tenemos un _React.Memo_, el caso es que le estamos pasando una propiedad más que cambia cada segundo... y se ha colado con el _spread operator_.

Si en vez del _spread operator_, le indicamos de forma explícita las _props_, veremos que ya no pasa esto:

_./src/demo/my-form.component.tsx_

```diff
    <div>
-      <NameComponent {...props} />
+      <NameComponent name={name} onChange={onChange} />
      <span>Current time: ${time}</span>
    </div>
```

Aquí ya podemos ver que esto no pasa.

Este caso puede parecer una tontería, pero en un proyecto real nos puede hacer mucho daño.

Ejemplo proyecto real

https://jfk-demo-2019.azurewebsites.net/#/
