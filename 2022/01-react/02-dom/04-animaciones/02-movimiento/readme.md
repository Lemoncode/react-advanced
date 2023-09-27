# 02 Movimiento

## Resumen

En este ejemplo vamos a ver cómo hacer una transición de una caja de izquierda a derecha con la librería _framer-motion_ y cómo hacer para que la caja no desaparezca de nuestra _screen_ cuando termina la transición.

## Paso a Paso

- Primero copiamos el ejemplo de _00-boilerplate_, y hacemos un _npm install_

```bash
npm install
```

- Vamos a instalar la librería de _Framer Motion_

```bash
npm install framer-motion
```

- Vamos a crear un estilo que llamaremos _caja_

_./src/global/styles.css_

```diff
body {
  font-family: sans-serif;
}

+.caja {
+  display: inline-flex;
+  border-radius: 10%;
+  margin: 30px;
+  padding: 30px;
+  background: darkcyan;
+  color: white;
+}
```

Vamos a mover la caja 100 pixeles (cuando se monta el componente), sustituimos el app completo:

_./src/app.tsx_

```tsx
import React from "react";
import { motion } from "framer-motion";

export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div className="caja" animate={{ x: 100 }}>
        <h1>Hello React !!</h1>
      </motion.div>
    </div>
  );
};
```

Para que lleve un poco más de tiempo vamos a ponerle una duración:

```diff
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div
        className="caja"
        animate={{ x: 100 }}
+        transition={{ duration: 2 }}
      >
        <h1>Hello React !!</h1>
      </motion.div>
    </div>
  );
};
```

Podemos usar otro tipo de medidas, por ejemplo queremos que vaya al
final de la pantalla en ancho, podemos usar _viewPortWidth_:

```diff
export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div
        className="caja"
-        animate={{ x: 100 }}
+       animate={{ x: "100vw" }}
        transition={{ duration: 2 }}
      >
        <h1>Hello React !!</h1>
      </motion.div>
    </div>
  );
};
```

Y si queremos que no desaparezca (y no queremos trabajar con pixeles a
fuego):

```diff
export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div
        className="caja"
-       animate={{ x: "100vw" }}
+       animate={{ x: "calc(100vw - 100%)" }}
        transition={{ duration: 2 }}
      >
        <h1>Hello React !!</h1>
      </motion.div>
    </div>
  );
};
```

Fíjate que no se queda del todo ajustado, si vemos el CSS, tenemos una margen de 30px, si lo quitamos va bien, así que podemos dejarlo y restarlo para evitar problemas:

```diff
      <motion.div
        className="caja"
-       animate={{ x: "calc(100vw - 100%)" }}
+       animate={{ x: "calc(100vw - 100% - 30px)" }}

        transition={{ duration: 2 }}
      >
```

> También podrámos poner el _box-sizing: border-box;_ pero el margen se
> sigue sin calcular
