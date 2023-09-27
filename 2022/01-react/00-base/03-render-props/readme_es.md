# 03 Render Props

## Resumen

Vamos a añadir una animación a un componente cuando se cumpla una condición, veremos que esto para un caso concreto está bien pero ¿Y si queremos reusar este comportamiento en otros componentes?

Veremos cómo hacer esto aplicando composición y la propiedad *children*,... nos daremos cuenta de una limitación.

Después nos pondremos a implementar este comportamiento usando *render* *props*.

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

- Lo copiamos, y hacemos un _npm install_

```bash
npm install
```

- Para manejarnos con animaciones nos vamos a instalar:
  - *Animate.css*: una librería para trabajar con animaciones *CSS* que es agnóstica de *framework*.
  - *React-transition-group*: una librería para gestionar animaciones con *React*.

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
          name="bloodPressureL"
          value={patient.bloodPressureL}
          onChange={handleChange}
        />
        /
        <input
          type="number"
          name="bloodPressureH"
          value={patient.bloodPressureH}
          onChange={handleChange}
        />
      </label>
    </form>
  );
};
```

- Vamos a instanciar ese componente en *APP*

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

Vamos a añadir una animación al campo "Temperatura" cuando la temperatura sea mayor a 38.9 el *input* hace un *flip* y lo ponemos con el fondo rojo, cuando cambia a menor volvemos a hacer un *flip* y ponemos el color de fondo a blanco.

Primero añadimos el *import* a _animate.css_ en el punto de entrada de nuestra aplicación:

_./src/app.tsx_

```diff
import React from "react";
import { MyForm } from "./my-form.component";
+ import "animate.css";
```

Podemos implementar la animación directamente en el componente _MyForm_, importamos la librería de *transition group* y vamos a añadir un *flag* para saber si un paciente tiene fiebre y que se recalcule cada vez que cambie la temperatura:

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

- Vamos a ver qué pinta tiene esto

```bash
npm start
```

Pero esto es un mal olor... el código cuesta de leer, y además a tus jefes les ha gustado la animación y quieren repetirla en más sitios.

Una opción que nos podemos plantear es implementar un componente genérico que haga de *wrapper* y utilizar la propiedad *children* esto quedaría de la siguiente manera:

_./src/animation-wrapper.component.tsx_

```tsx
import React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  inProp: boolean;
  children: React.ReactNode;
}

export const AnimationWrapper: React.FC<Props> = (props) => {
  const { inProp, children } = props;

  return (
    <CSSTransition
      in={inProp}
      classNames={{
        enter: "animate__animated animate__flipInX",
        exit: "animate__animated animate__flipOutX",
      }}
      timeout={500}
    >
      {children}
    </CSSTransition>
  );
};
```

Y vamos a actualizar nuestro código:

_./src/my-form.component.tsx_

```diff
import React from "react";
- import { CSSTransition } from "react-transition-group";
+ import { AnimationWrapper } from "./animation-wrapper.component";
// (...)

-        <CSSTransition
-          in={feverFlag}
-          classNames={{
-            enter: "animate__animated animate__flipInX",
-            exit: "animate__animated animate__flipOutX",
-          }}
-          timeout={500}
-        >
+        <AnimationWrapper inProp={feverFlag}>
          <label>
            Temperatura:
            <input
              type="number"
              name="temperature"
              value={patient.temperature}
              onChange={handleChange}
              style={{ background: feverFlag ? "lightCoral" : "white" }}
            />
          </label>
-        </CSSTransition>
+        </AnimationWrapper>
```

No está mal, pero qué pasa si queremos informar al componente hijo de si se está ejecutando una animación, a nivel de *wrapper* podemos sacar estos datos de la siguiente manera:

_./src/animation-wrapper.component.tsx_

```diff
export const AnimationWrapper : React.FC<Props> = (props) => {
  const { inProp, children } = props;
+  const [animationInProgress, setAnimationInProgress] = React.useState(false);

  return (
      <CSSTransition
        in={inProp}
        classNames={{
          enter: "animate__animated animate__flipInX",
          exit: "animate__animated animate__flipOutX",
        }}
        timeout={500}
+       onEnter={() => setAnimationInProgress(true)}
+       onEntered={() => setAnimationInProgress(false)}
+       onExit={() => setAnimationInProgress(true)}
+       onExited={() => setAnimationInProgress(false)}
      >
        {children}
      </CSSTransition>
  )
};
```

Pero... ouch, aquí se nos complica la cosa, podríamos plantear tirar por contexto pero esa solución es engorrosa, o usar _React.cloneElement_ pero eso es casi peor todavía.

Vamos a implementar esto con *render props*.

Primero vamos a reproducir el comportamiento actual con *render props*, fíjate:

- Que ahora en vez de *children*, vamos a crear una propiedad de tipo función que devuelve un componente.
- Fíjate que en esa función vamos a pasarle por parámetro el *flag* en el que le indicamos si hay una animación en curso (ya veremos cómo consumir esto).

_./src/animation-wrapper.component.tsx_

```diff
import React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  inProp: boolean;
-  children: React.ReactNode;
+  render: (animationInProgress: boolean) => JSX.Element;
}

export const AnimationWrapper: React.FC<Props> = (props) => {
-  const { inProp, children } = props;
+  const { inProp, render } = props;

  const [animationInProgress, setAnimationInProgress] = React.useState(false);

  return (
    <CSSTransition
      in={inProp}
      classNames={{
        enter: "animate__animated animate__flipInX",
        exit: "animate__animated animate__flipOutX",
      }}
      timeout={500}
      onEnter={() => setAnimationInProgress(true)}
      onEntered={() => setAnimationInProgress(false)}
      onExit={() => setAnimationInProgress(true)}
      onExited={() => setAnimationInProgress(false)}
    >
-      {children}
+      {render(animationInProgress)}
    </CSSTransition>
  );
};
```

Vamos ahora a adaptar nuestro componente que consume esta *render prop*, y darle uso al parámetro de _animationInProgress_:

_./src/my-form.component.tsx_

```diff
    </label>

-    <AnimationWrapper inProp={feverFlag}>
+    <AnimationWrapper inProp={feverFlag} render={(animationInProgress) => (
      <label>
        Temperatura:
        <input
          type="number"
          name="temperature"
          value={patient.temperature}
          onChange={handleChange}
          style={{ background: feverFlag ? "lightCoral" : "white" }}
        />
+       {animationInProgress ? "Animation in progress" : "quiet"}
      </label>
+    )}/>
-    </AnimationWrapper>
    <label>
```

# Ejercicio

Veamos qué tal de reusable es la *render prop* que hemos creado, vamos a recrear el mismo comportamiento para el segundo campo de tensión arterial, si está por encima de 14 debería de saltar la animación (también podemos hacer que se ponga con fondo en rojo)

# Render Props en el mundo Real, Formik o Final Form

En este ejemplo puedes ver un caso de uso real:

https://github.com/Lemoncode/master-frontend-lemoncode/blob/master/04-frameworks/01-react/05-architecture/06-form-validation/src/pods/login/login.component.tsx

# Challenge

En este post nos explican cómo hacer una *render prop* para capturar el movimiento del ratón:

https://es.reactjs.org/docs/render-props.html

En este ejemplo cómo hacer un *magnifier* de imágenes a pelo:

https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp

¿Te animas a hacer una *render prop* que de la posición del ratón y  combinarla con el *magnifier*?

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
