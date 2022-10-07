# 02 Movimiento

# Pasos

Vamos a mover la caja 100 pixeles (cuando se monta el componente), sustituimos el app completo:

```tsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div
        className="caja"
        animate={{ x: 100 }}
        transition={{ duration: 2 }}
      >
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

Fijate que no se queda del todo ajustado, si vemos el CSS, tenemos una
margen de 30px, si lo quitamos va bien, así que podemos dejarlo y restarlo para
evitar problemas:

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

Eso de 30px es un poco mágico, vamos a hacer un truco, podemos poner
dos elementos uno al principio y otro al final y jugando con flexbox
hacer que transicionen.

Vamos a reemplazar el app completo:

- Cambiamos el css, le damos un ancho fijo al elemento de hello reat
  de 100px.

```diff
.caja {
  display: inline-flex;
  border-radius: 10%;
  margin: 30px;
  padding: 30px;
  background: darkcyan;
  color: white;
+  width: 100px;
}
```

- Cambiamos en inline-flex por un flex que tome todo el ancho.
- Añadimos dos divs, uno al principio y otro al final del div
  (para eso usamos las propiedades del flexbox).

```tsx
return (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <motion.div className="caja">
      <h1>Hello React !!</h1>
    </motion.div>
    <div className="caja">
      <h1>Hello React !!</h1>
    </div>
  </div>
);
```

- Vamos a poner el _flexDirection_ a _row_, y le damos un _justify-content_
  a _space-between_ para que se ajuste al ancho de la pantalla.

```diff
return (
-  <div style={{ display: "flex", flexDirection: "column" }}>
+  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

    <motion.div className="caja">
```

- Añadimos un ref para tener la posición del segundo elemento.

```diff
export const App = () => {
+  const endBoxRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <motion.div className="caja">
        <h1>Hello React !!</h1>
      </motion.div>
-      <div className="caja" >
+      <div className="caja" ref={endBoxRef}>
       <h1>Hello React !!</h1>
      </div>
    </div>
  );
};
```

- Lanzamos animación del primer elemento hasta el segundo elemento.
- Vamos ahora a poner la opacity del segundo elemento a cero.
