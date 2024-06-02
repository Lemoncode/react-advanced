# 01 Drag

Ya tenemos un tablero básico, vamos a por el primer paso, poder arrastrar una tarjeta.

## Paso a paso

Hemos dedicido usar `Pragmatic drag and drop` de Atlassian, así que lo primero que haremos es instalarlo:

```bash
npm install @atlaskit/pragmatic-drag-and-drop
```

Pragmatic drag and drop proporciona una función de arrastre que se adjunta a un elemento para habilitar el comportamiento de arrastre. Al usar React, esto se hace en un useEffect, que vamos a hacer:

    - El drag arranca en el card component.
    - Nos traemos el import de `draggable` de la librería de pragmatic drag and drop.
    - Usamos `useRef` para tener una referencía al div padre del `card`.
    - Ejecutamos un `useEffect` que se encargará de llamar a `draggable` con la referencia al div padre del `card`.

> Una vez que lo tengamos picado, arreglaremos un tema y veremos como funciona el `useEffect` y la función de cleanup.

_./src/kanban/components/card/card.component.tsx_

```diff
import React from "react";
+ import { useEffect, useRef } from "react";
+ import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CardContent } from "../../model";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

+ const ref = useRef(null);

+ useEffect(() => {
+   const el = ref.current;
+   return draggable({
+     element: el,
+   });
+ }, []);

-  return <div className={classes.card}>{content.title}</div>;
+  return <div ref={ref} className={classes.card}>{content.title}</div>;
};
```

Fijate que nos de un error, esto es porque `draggable` espera un elemento de tipo `HTMLElement` y puede que el `useRef` tuviera un tipo null, sabemos que no es así, pero en modo estricto nos curamos siempre en salud, para que esto funcione, vamos a instalarnos una librería `tiny-invariant` que comprueba si el objeto existe, y sin no suelta una excepción (así siempre tendremos un no nulo).

```bash
npm install tiny-invariant
```

```diff
+ import invariant from "tiny-invariant";

 useEffect(() => {
   const el = ref.current;

+   // Agrega esto para evitar que TypeScript en modo estricto se queje sobre null
+   // en la llamada a draggable({ element: el });
+   invariant(el);

   return draggable({
     element: el,
   });
 }, []);
```

Merce la pena parar un segundo y ver el código de esta librería:

https://github.com/alexreardon/tiny-invariant/blob/master/src/tiny-invariant.ts

Ahora si, si ejecutamos la aplicación, veremos que podemos arrastrar las tarjetas.
