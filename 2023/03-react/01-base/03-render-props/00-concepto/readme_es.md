# 03 Render Props

## Resumen

Vamos a añadir una animación a un componente cuando se cumpla una condición, veremos que esto para un caso concreto está bien pero ¿Y si queremos reusar este comportamiento en otros componentes?

Veremos cómo hacer esto aplicando composición y la propiedad _children_,... nos daremos cuenta de una limitación.

Después nos pondremos a implementar este comportamiento usando _render_ _props_.

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

## Paso a Paso

- Lo copiamos, y hacemos un _npm install_

```bash
npm install
```

- Para manejarnos con animaciones nos vamos a instalar:
  - _Animate.css_: una librería para trabajar con animaciones _CSS_ que es agnóstica de _framework_.
  - _React-transition-group_: una librería para gestionar animaciones con _React_.

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

Añadimos algo de estilado:

_./src/my-form.component.module.css_

```tsx
.form {
  display: flex;
  flex-direction: column;
}

.form > div {
  display: flex;
  flex-direction: column;
}
```

_./src/my-form.component.tsx_

```tsx
import React from "react";
import classes from "./my-form.component.module.css";

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
    <form className={classes.form}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={patient.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Temperatura:</label>
        <input
          type="number"
          name="temperature"
          value={patient.temperature}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Presión arterial:</label>
        <div>
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
        </div>
      </div>
    </form>
  );
};
```

- Vamos a instanciar ese componente en _APP_

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

Vamos a añadir una animación al campo "Temperatura" cuando la temperatura sea mayor a 38.9 el _input_ hace un _flip_ y lo ponemos con el fondo rojo, cuando cambia a menor volvemos a hacer un _flip_ y ponemos el color de fondo a blanco.

Primero añadimos el _import_ a _animate.css_ en el punto de entrada de nuestra aplicación:

_./src/app.tsx_

```diff
import React from "react";
import { MyForm } from "./my-form.component";
+ import "animate.css";
```

Podemos implementar la animación directamente en el componente _MyForm_, importamos la librería de _transition group_ y vamos a añadir un _flag_ para saber si un paciente tiene fiebre y que se recalcule cada vez que cambie la temperatura:

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
+        enter: "animate__animated animate__zoomIn",
+        exit: "animate__animated animate__zoomOut",
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

Bueno ya tenemos algo (más adelante si tenemos tiempo veremos otra librería más específica de React y sencilla)

Pero esto es un mal olor... el código cuesta de leer, y además a tus jefes les ha gustado la animación y quieren repetirla en más sitios.

Una opción que nos podemos plantear es implementar un componente genérico que haga de _wrapper_ y utilizar la propiedad _children_ esto quedaría de la siguiente manera:

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
        enter: "animate__animated animate__zoomIn",
        exit: "animate__animated animate__zoomOut",
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

No está mal, pero qué pasa si queremos informar al componente hijo de si se está ejecutando una animación, a nivel de _wrapper_ podemos sacar un flag interno ¿pero como se lo pasamos al componente que hay en children?

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

Vamos a implementar esto con _render props_.

Primero vamos a reproducir el comportamiento actual con _render props_, fíjate:

- Que ahora en vez de _children_, vamos a crear una propiedad de tipo función que devuelve un componente.
- Fíjate que en esa función vamos a pasarle por parámetro el _flag_ en el que le indicamos si hay una animación en curso (ya veremos cómo consumir esto).

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

Vamos ahora a adaptar nuestro componente que consume esta _render prop_, y darle uso al parámetro de _animationInProgress_ (lo mostramos y aprovechamos para deshabilitar el input mientras la animación está en marcha):

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
+        disabled={animationInProgress}
          style={{ background: feverFlag ? "lightCoral" : "white" }}
        />
+       {animationInProgress ? "Animation in progress" : "quiet"}
      </label>
+    )}/>
-    </AnimationWrapper>
    <label>
```

Está forma de definir la _render prop_ es un poco engorrosa, existe otra aproximación que se llama _children as a prop_ (tampoco es la alegría de la huerta, pero es mejor) vamos a refactorizarlo:

_./src/animation-wrapper.component.tsx_

```diff
interface Props {
   inProp: boolean;
-  render: (animationInProgress: boolean) => JSX.Element;
+  children: (animationInProgress: boolean) => JSX.Element;
}
```

```diff
export const AnimationWrapper: React.FC<Props> = (props) => {
-  const { inProp, children } = props;
+ const { inProp, children  } = props;
  const [animationInProgress, setAnimationInProgress] = React.useState(false);

  return (
    <CSSTransition
      in={inProp}
      classNames={{
        enter: "animate__animated animate__zoomIn",
        exit: "animate__animated animate__zoomOut",
      }}
      timeout={500}
      onEnter={() => setAnimationInProgress(true)}
      onEntered={() => setAnimationInProgress(false)}
      onExit={() => setAnimationInProgress(true)}
      onExited={() => setAnimationInProgress(false)}
    >
-      {render(animationInProgress)}
+      {children(animationInProgress)}
    </CSSTransition>
```

Y vamos ahora a usarlo:

_./src/my-form.component.tsx_

```diff
-      <AnimationWrapper
-        inProp={feverFlag}
-        render={(animationInProgress) => (
-          <div>
-            <label>Temperatura:</label>
-            <input
-              type="number"
-              name="temperature"
-              value={patient.temperature}
-              disabled={animationInProgress}
-              onChange={handleChange}
-              style={{ background: feverFlag ? "#BC5B40" : "#00AD74" }}
-            />
-            {animationInProgress ? "Animation in progress" : "quiet"}
-          </div>
-        )}
-      />
+     <AnimationWrapper inProp={feverFlag}>
+        {(animationInProgress) => (
+          <label>
+            Temperatura:
+            <input
+              type="number"
+              name="temperature"
+              value={patient.temperature}
+              onChange={handleChange}
+              disabled={animationInProgress}
+              style={{ background: feverFlag ? "lightCoral" : "white" }}
+            />
+            {animationInProgress ? "Animation in progress" : "quiet"}
+          </label>
+        )}
+      </AnimationWrapper>
```

¿Qué sintaxis te parece mejor?

# Ejercicio

Veamos qué tal de reusable es la _render prop_ que hemos creado, vamos a recrear el mismo comportamiento para el segundo campo de tensión arterial, si está por encima de 14 debería de saltar la animación (también podemos hacer que se ponga con fondo en rojo)

# Render Props en el mundo Real, Formik o Final Form

En este ejemplo puedes ver un caso de uso real:

https://github.com/Lemoncode/master-frontend-lemoncode/blob/master/04-frameworks/01-react/05-architecture/06-form-validation/src/pods/login/login.component.tsx

# Challenge

En este post nos explican cómo hacer una _render prop_ para capturar el movimiento del ratón:

https://es.reactjs.org/docs/render-props.html

En este ejemplo cómo hacer un _magnifier_ de imágenes a pelo:

https://www.w3schools.com/howto/howto_js_image_magnifier_glass.asp

¿Te animas a hacer una _render prop_ que de la posición del ratón y combinarla con el _magnifier_?

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)


