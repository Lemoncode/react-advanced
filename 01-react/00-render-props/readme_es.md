# 00 Render Props

## Resumen

Vamos a añadir una animación un componente cuando se cumpla una condición, veremos que esto para un caso
concreto está bien pero ¿Y si queremos reusar este comportamiento en otros componentes?

Veremos como hacer esto aplicando composición y la propiedad children, ... nos daremos cuenta
de una limitación.

Después nos pondremos a implementar este comportamiento usando render props.

Este ejemplo toma como punto de partida el ejemplo _02-webpack-boiler_.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Para manejarnos con animaciones nos vamos a instalar:
  - Animate.css: una librería para trabajar con animaciones CSS que es agnóstica de framework.
  - React-transition-group: una librería para gestionar animaciones con React.

```bash
npm install animate.css --save
```

```bash
npm install react-transition-group --save
```

```bash
npm install @types/react-transition-group --save-dev
```

- Nos vamos a crear un componente que llamaremos _my-form.component_ en este
  componente vamos a añadir un formulario con datos del paciente:

_./src/my-form.component.tsx_

```tsx
import React from "react";

interface Patient {
  name: string;
  temperature: number;
  bloodPressureH: number;
  bloodPressureL: number;
}

export const MyForm = () => {
  const [patient, setPatient] = React.useState<Patient>({
    name: "",
    temperature: 0,
    bloodPressureH: 0,
    bloodPressureL: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  return (
    <form>
      <label>
        Nombre:
        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Temperatura:
        <input
          type="number"
          name="temperature"
          value={patient.temperature}
          onChange={handleChange}
        />
      </label>
      <label>
        Presión arterial:
        <input
          type="number"
          name="bloodPressureH"
          value={patient.bloodPressureH}
          onChange={handleChange}
        />
        /
        <input
          type="number"
          name="bloodPressureL"
          value={patient.bloodPressureL}
          onChange={handleChange}
        />
      </label>
    </form>
  );
};
```

- Vamos a instanciar ese componente en APP

_./src/app.tsx_

```diff
import React from "react";
+ import {MyForm} from "./my-form.component";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <MyForm />;
};
```

Probamos que esto funciona:

```bash
npm start
```

Vamos a añadir una animación al campo "Temperatura" cuando la temperatura sea mayor a 38.9 el input hace un flip y lo ponemos con el fondo rojo, cuando
cambia a menor volvemos a hacer un flip y ponemos el color de fondo a blanco.

Primero añadimos el import a _animate.css_ en el punto de entrada
de nuestra aplicación:

_./src/app.tsx_

```diff
import React from "react";
import { MyForm } from "./my-form.component";
+ import "animate.css";
```

Podemos implementar al animación directamente en el componente _MyForm_,
importamos la librería de transition group y vamos a añadir un flag
para saber si un paciente tiene fiebre y que se recalcule cada
vez aue cambie la temperatura:

_./src/my-form.component.tsx_

```diff
import React from "react";
+ import { CSSTransition } from "react-transition-group";
// (...)
export const MyForm = () => {
  const [patient, setPatient] = React.useState<Patient>({
    name: "",
    temperature: 0,
    bloodPressureH: 0,
    bloodPressureL: 0,
  });

+  const [feverFlag, setFeverFlag] = React.useState(false);

+  React.useEffect(() => {
+    setFeverFlag(patient.temperature > 38.9);
+  }, [patient.temperature]);
```

Vamos a por la animación:

_./src/my-form.component.tsx_

```diff
+    <CSSTransition
+      in={feverFlag}
+      classNames={{
+        enter: "animate__animated animate__flipInX",
+        exit: "animate__animated animate__flipOutX",
+      }}
+      timeout={500}
+    >
    <label>
      Temperatura:
      <input
        type="number"
        name="temperature"
        value={patient.temperature}
        onChange={handleChange}
+       style={{background: (feverFlag) ? "lightCoral" : "white"}}
      />
    </label>
+    </CSSTransition>
    <label>
```

> Aquí le decimos que la animación se active cuando el flag _feverFlag_ cambie.

- Vamos a ver que pinta tiene esto

```bash
npm start
```

Pero esto es un mal olor... el código cuesta de leer, y además a tus jefes
les ha gustado la animación y quieren repetirla en más sitios.

Una opción que nos podemos plantear es implementar un componente genérico que
haga de wrapper y utilizar la propiedad children esto quedaría de la
siguiente manera:

```tsx

```

```diff

```

No esta mal, pero qué pasa si queremos informar al componente hijo de
si se está ejecutando una animación... ouch, aquí se nos complica la cosa,
podríamos plantear tirar por contexto pero esa solución es engorrosa.

Vamos a implementar esto con render props.

Primero vamos a reproducir el comportamiento actual con render props:

```

```

Ahora vamos a capturar cuando se lanza y termina una animación:

Y vamos a pasarselo al componente que pintamos en las render props
por parametro !!

```tsx

```

En el componente recibimos el parametro y vamos a añadir un indicador
que nos diga si la animación está en curso o no

```diff

```

¡ Ya lo tenemos ! Y si quisieramos hacer lo mismo para la presíon arterial
pues sólo tendrámos que añadir nuestro componente y configurar la render props:

```diff

```
