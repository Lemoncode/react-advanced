# 00 Basics UseRef

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

En este ejemplo vamos a ver cómo cambiar el foco a un componente para ello utilizaremos dos aproximaciones:

- Utilizando _GetDocumentElementById_.
- Utilizando _useRef_

Discutiremos y entenderemos porque es mejor utilizar _useRef_.

## Paso a Paso

- Primero copiamos el ejemplo _boiler plate_, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm run dev
```

En nuestro fichero de aplicación vamos a añadir dos input y un
botón:

_./src/app.tsx_

```diff
import React from "react";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+
+  const handleButtonClick = () => {
+   console.log('button clicked!');
+ }
+
+  return (
+    <div>
+      <input type="text" />
+      <input type="text" />
+      <button onClick={handleButtonClick}>Focus</button>
+    </div>
+ )
};
```

Queremos cuando pulsemos en el botón se vaya el foco al primer input (en el mundo real esto nos podría servir para por ejemplo revisar el primer campo que tiene errores de validación).

¿Qué podemos hacer?

Vamos a por el sabor más clásico, le ponemos un _id_ al _input_
y accedemos por el _dom_...

_./src/app.tsx_

```diff
  const handleButtonClick = () => {
-   console.log('button clicked!');
+   const inputA = document.getElementById('inputA');
+   if (inputA) {
+     inputA.focus();
+   }
 }

  return (
    <div>
-      <input type="text" />
+      <input type="text" id="inputA" />
```

Esto funciona, pero ¿Qué problemas me puedo encontrar?

- Primero me estoy atando al DOM, si el día de mañana cambia ese Id, o lo muevo de componente va a ser complicado de encontrar el error.

- Por otro lado el _id_ podría estar duplicado y me podría traer quebradores de cabeza, por ejemplo podría tener múltiples instancias del componente y buscando por _id_ no tengo alcance restringido.

- Otro problema, ese acceso al DOM es lento, y podría cambiar la ese elemento en un repintado, con lo que de primeras no me puedo plantear guardarlo en un estado de _React_.

- Si a futuro me planteara una migración a _React Native_, también me encontraría problemas ya que esa _api_ no existe.

Veamos como hacer esto con _refs_:

- Primero defino una variable y le asignado un _useRef_.

_./src/app.tsx_

```diff
+ import React from "react";

export const App = () => {
+  const inputARef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
```

- Después lo emparejo con la etiqueta del _input_.

_./src/app.tsx_

```diff
  return (
    <div>
-      <input type="text" id="inputA" />
+      <input type="text" ref={inputARef} />

```

- Finalmente lo reemplazo en el _handler_ (fíjate que uso la instancia mutable _current_)

_./src/app.tsx_

```diff
  const handleButtonClick = () => {
-    const inputA = document.getElementById("inputA");
-    if (inputA) {
-      inputA.focus();
-    }
+   inputARef.current?.focus();
  };
```

Si probamos tenemos el mismo resultado.

Que beneficios obtenemos con esta aproximación:

- El _useRef_ se queda en el ámbito del componente no puedo salir fuera del mismo.
- Ya no tengo problemas con _ids_ repetidos.
- Si un día tengo que migrar a _React Native_ estoy usando _apis_ estándares (aunque tendría que hacer adaptaciones)

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
