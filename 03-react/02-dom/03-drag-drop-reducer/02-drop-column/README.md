# 01 Drop

Vamos a implementar el drop, ¿Cual crees tu que debería ser al área \_droppable?

Seguro que a bote pronto se te ocurre decir que las columnas... tiene todo el sentido.

En este ejemplo vamos a hacer que las columnas sean droppables, y que al soltar un elemento en una columna, este se añada a la lista de elementos de la columna.

Después nos vamos a encontrar con un problema y enumeraremos que nos haría flata para dejarlo fino (por tema de tiempo no implementaramos ese camino complicado, aunque es buen ejercicio para el lector).

Y en el siguiente ejemplo _recogeremos carrete_ e implementaremos el drop en las cards y veremos que problemas resuelve esta aproximacíon y que trucos debemos de aplicar (no hay bala de plata).

## Paso a paso

Hemos dicho que ibamos a marcar el componente columna como `droppable`.

_./src/kanban/components/column/column.component.tsx_

```diff
- import React from "react";
+ import React, { useState, useEffect, useRef } from "react";
+ import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";

interface Props {
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content } = props;
+  const ref = useRef(null);
+  const [isDraggedOver, setIsDraggedOver] = useState(false);

+  useEffect(() => {
+    const el = ref.current;
+    invariant(el);
+
+    return dropTargetForElements({
+      element: el,
+      onDragEnter: () => setIsDraggedOver(true),
+      onDragLeave: () => setIsDraggedOver(false),
+      onDrop: () => setIsDraggedOver(false),
+    });
+  }, []);

  return (
-    <div className={classes.container}>
+    <div className={classes.container} ref={ref}
+       style={{backgroundColor: (isDraggedOver) ? "white" : "aliceblue"}}
+>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} />
      ))}
    </div>
  );
};
```

¿Qué estamos haciendo aquí?

- `DropTargetForElements` es un hook que nos permite marcar un elemento como droppable.
- Jugamos con los eventos `onDragEnter`, `onDragLeave` y `onDrop` para cambiar el color de fondo del contenedor de la columna y que sea vea que podemos soltar ahí contenido.

** Me he quedado aquí

¿Pinta bien eh? Peeero si intentamos soltar, verás que no hace nada, nos hace falta hacer lo siguiente:

- Por un lado saber de que tarjeta estamos hablando.
- Por otro en que columna estamos.

A fin de cuentas por detrás lo que tenemos es un array de columnas en las que para cada columna tenemos un array de cards.

Vams a guardar esa información --> 

Después lo que hacemos es al hacer drop realizar la operación

¿Cómo hacemos esto? Monitor...

--> Bueno parece que lo tenemos ¿SI...? NO
problema cards intercalados

Si tiramos por aproxiamcíon columna dolor cabeza
array refs
