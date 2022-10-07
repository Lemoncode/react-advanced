# 01 Hola Framer

## Resumen

Meter las animaciones justas y elegantes en una aplicación le da un toque de fluidez y profesionalidad, pasarte de animaciones o meterlas sin sentido
un tufo a hortera.

En este ejemplo vamos a ver como meter animaciones en una aplicación de React usando Framer Motion: esta librería es curiosa ya que nos oculta mucha
complejidad (creamos animaciones añadiendo wrappers de componentes primitivos)
y además usa la aproximación Spring (aplica leyes de la física en los movimientos para hacerlos más realistas y suaves).

Pongámonos manos a la obra, vamos a hacer nuestro "hola mundo" con Framer.

## Paso a Paso

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a instalar la librería de Framer Motion

```bash
npm install framer-motion
```

- Vamos a crear un estilo que llamaremos _caja_

_./global/styles.css_

```css
.caja {
  width: 200px;
  height: 200px;
  border-radius: 80%;
  background: palevioletred;
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
