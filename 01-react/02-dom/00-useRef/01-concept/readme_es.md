# 00 Basics UseRef

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

En este ejemplo vamos a ver cómo cambiar el foco a un componente para ello utilizaremos dos aproximaciones:

- Utilizando *GetDocumentElementById*.
- Utilizando *useRef*

Discutiremos y entenderemos porque es mejor utilizar *useRef*.

## Paso a Paso

- Primero copiamos el ejemplo *boiler plate*, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
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

Vamos a por el sabor más clásico, le ponemos un *id* al *input*
y accedemos por el *dom*...

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
  
- Por otro lado el *id* podría estar duplicado y me podría traer quebradores de cabeza, por ejemplo podría tener múltiples instancias del componente y buscando por *id* no tengo alcance restringido.
  
- Si a futuro me planteara una migración a *React Native*, también me encontraría problemas ya que esa *api* no existe.

Veamos como hacer esto con *refs*:

- Primero defino una variable y le asignado un *useRef*.

_./src/app.tsx_

```diff
export const App = () => {
+  const inputARef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
```

- Después lo emparejo con la etiqueta del *input*.

_./src/app.tsx_

```diff
  return (
    <div>
-      <input type="text" id="inputA" />
+      <input type="text" ref={inputARef} />

```

- Finalmente lo reemplazo en el *handler* (fíjate que uso la instancia mutable *current*)

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

- El *useRef* se queda en el ámbito del componente no puedo salir fuera del mismo.
- Ya no tengo problemas con *ids* repetidos.
- Si un día tengo que migrar a *React Native* estoy usando *apis* estándares (aunque tendría que hacer adaptaciones)
