# 01 Hola Framer

## Resumen

Meter las animaciones justas y elegantes en una aplicación le da un toque de fluidez y profesionalidad, pasarte de animaciones o meterlas sin sentido pasa de ser un tufo a hortera.

En este ejemplo vamos a ver como meter animaciones en una aplicación de React usando *Framer Motion*: esta librería es curiosa ya que nos oculta mucha complejidad (creamos animaciones añadiendo *wrappers* de componentes primitivos)
y además usa la aproximación *Spring* (aplica leyes de la física en los movimientos para hacerlos más realistas y suaves).

Pongámonos manos a la obra, vamos a hacer nuestro "hola mundo" con *Framer*.

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a instalar la librería de *Framer Motion*

```bash
npm install framer-motion --save
```

- Vamos a crear un estilo que llamaremos _caja_

_./global/styles.css_

```diff
body {
  font-family: sans-serif;
}

.caja {
  display: inline-flex;
  border-radius: 10%;
  margin: 30px;
  padding: 30px;
  background: darkcyan;
  color: white;
}
```

- Y en vez de añadir un _div_ normal vamos a añadir un _motion.div_ en nuestra app.

_./src/app.tsx_

```diff
import React from "react";
+ import { motion } from "framer-motion";

export const App = () => {
  return (
+     <motion.div className="caja" initial={{opacity: 0}} animate={{opacity: 1}}>
      <h1>Hello React !!</h1>
+     </motion.div>
  );
};
```

Vamos a seguir jugando, en este caso queremos que el componente se haga un poco más grande cuando hagamos *hover* sobre él.

_./src/app.tsx_

```diff
export const App = () => {
  return (
-    <motion.div className="caja" initial={{opacity: 0}} animate={{opacity: 1}}>
+    <motion.div className="caja" whileHover={{ scale: 1.2 }}>
      <h1>Hello React !!</h1>
     </motion.div>
  );
};
```

¿Y si quiero lanzar una animación cuando se hace clic en un botón?
Aquí podemos jugar con el *state*:

_./src/app.tsx_

```diff
export const App = () => {
+  const [myScale, setMyScale] = React.useState(1);

  return (
+  <div style={{ display: "inline-flex", flexDirection: "column" }}>
-    <motion.div className="caja" whileHover={{ scale: 1.2 }}>
+    <motion.div className="caja" animate={{ scale: myScale }}>

      <h1>Hello React !!</h1>
    </motion.div>
+   <button onClick={() => setMyScale(1.5)}>Anime !</button>
+   <button onClick={() => setMyScale(1)}>Shrink !</button>
+  </div>
  );
};
```

Vale pero igual yo lo que quiero es que la animación vaya de ida y vuelta
sin tener que pulsar el botón de *shrink*...

```diff
export const App = () => {
-  const [myScale, setMyScale] = React.useState(1);
+  const [myScale, setMyScale] = React.useState([1, 1]);


  return (
  <div style={{ display: "inline-flex", flexDirection: "column" }}>
    <motion.div className="caja" animate={{ scale: myScale }}>
      <h1>Hello React !!</h1>
    </motion.div>
-   <button onClick={() => setMyScale(1.5)}>Anime !</button>
-   <button onClick={() => setMyScale(1)}>Shrink !</button>
+   <button onClick={() => setMyScale([1, 1.5, 1])}>Bigger smaller !</button>
  </div>
  );
};
```

Esta chulo, pero quiero que la animación de vuelta se haga más lenta,
¿Qué puedo hacer? Vamos a crear una propiedad de *duration*.

```diff
export const App = () => {
  const [myScale, setMyScale] = React.useState([1, 1]);


  return (
  <div style={{ display: "inline-flex", flexDirection: "column" }}>
    <motion.div
      className="caja"
      animate={{ scale: myScale }}
+        transition={{
+          times: [0, 0.1, 1],
+          duration: 3,
+        }}
    >
      <h1>Hello React !!</h1>
    </motion.div>
    <button onClick={() => setMyScale([1, 1.5, 1])}>Bigger smaller !</button>
  </div>
  );
};
```

- Pongamos que queremos dejar la animación corriendo en bucle, una cosa qué podemos hacer usar la propiedad _yoyo_.

```diff
      <motion.div
        className="caja"
        animate={{ scale: myScale }}
        transition={{
          times: [0, 0.1, 1],
          duration: 3,
+          yoyo: Infinity,
        }}
      >
```

> Hay más valores, _yoyo_, _loop_ (añadimos bucle inifinity o número de veces...)

```diff
      <motion.div
        className="caja"
        animate={{ scale: myScale }}
        transition={{
          times: [0, 0.1, 1],
          duration: 3,
-          yoyo: Infinity,
+          loop: 5,
        }}
      >
```

Mejor quitadlo del código que nos puede dejar rallados XDDD

- Ahora tenemos un problema, pinchando en el botón solo podemos ejecutar la animación una sola vez, el problema es que el *setState* lo ponemos al mismo valor siempre, ¿Qué podemos hacer? Aquí podemos
  dejar de usar la aproximación *declarative* e ir a por código, podemos usar el hook _useAnimation_, vamos a reemplazar el app completo:

_./src/app.tsx_

```tsx
import React from "react";
import { motion, useAnimation } from "framer-motion";

export const App = () => {
  const controls = useAnimation();

  const handleAnimation = () => {
    controls.start({
      scale: [1, 1.5, 1],
    });
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div className="caja" animate={controls}>
        <h1>Hello React !!</h1>
      </motion.div>
      <button onClick={handleAnimation}>Bigger smaller !</button>
    </div>
  );
};
```
