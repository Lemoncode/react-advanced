# Lab Refactor Cards

El componente de Cards se ha quedado con mucho código y empieza a ser complicado de mantener, más cuando seguramente empiece inflarse funcionalidad, es hora de "vaciar el cangrejo".

## Punto de partida

Cuando queremos simplificar un componente, no vale con sacar código de cualquier manera a un hook y ya está, lo suyo es agruparlo y que tengamos piezas acotadas.

Nos vamos a centrar en extraer en un hook la funcionalidad de _drag_ y la de _drop_

## Pistas

- Vamos a crear un fichero que llamaremos: _card-drag-drop.hook.tsx_

- Crearemos un hook que se llamar: `useCardDragDrop`

- Nos llevamos el código de _drag_ y _drop_ del componente _Card_ al hook (ojo a ver que nos hace falta).

- El hook debe devolver un objeto con las propiedades: `dragRef` y `dropRef`

## Solución

_./src/components/card/card-drag-drop.hook.tsx_

```tsx
import {
  ActionTypes,
  CardContent,
  DragItemInfo,
  ItemTypes,
  createDragItemInfo,
} from "@/kanban/model";
import { useDrag, useDrop } from "react-dnd";
import { useKanbanContext } from "../../providers/kanban.context";

export const useCardDragDrop = (columnId: number, content: CardContent) => {
  const { kanbanContent, dispatch } = useKanbanContext();

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, _) => {
        dispatch({
          type: ActionTypes.MOVE_CARD,
          payload: {
            columnDestinationId: columnId,
            dropCardId: content.id,
            dragItemInfo: item,
          },
        });

        return {
          name: `DropColumn`,
        };
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [kanbanContent]
  );

  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content), // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  // TODO: lo suyo sería cambiar esto por dragRef, dropRef y opacityDrag
  return { drag, drop, opacity };
};
```

_./src/components/card/card.component.tsx_

```diff
import React from "react";
- import { useDrag, useDrop } from "react-dnd";
import {
  CardContent,
-  ItemTypes,
-  createDragItemInfo,
-  DragItemInfo,
  ActionTypes,
} from "../../model";
import { useKanbanContext } from "../../providers/kanban.context";
import classes from "./card.component.module.css";
+ import { useCardDragDrop } from "./card-drag-drop.hook";
```

```diff
export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
-  const { kanbanContent, dispatch } = useKanbanContext();
+  const { dispatch } = useKanbanContext();
+  const { drag, drop, opacity } = useCardDragDrop(columnId, content);
-
-  const [_, drop] = useDrop(
-    () => ({
-      accept: ItemTypes.CARD,
-      drop: (item: DragItemInfo, _) => {
-        dispatch({
-          type: ActionTypes.MOVE_CARD,
-          payload: {
-            columnDestinationId: columnId,
-            dropCardId: content.id,
-            dragItemInfo: item,
-          },
-        });
-
-        return {
-          name: `DropColumn`,
-        };
-      },
-      collect: (monitor: any) => ({
-        isOver: monitor.isOver(),
-        canDrop: monitor.canDrop(),
-      }),
-    }),
-    [kanbanContent]
-  );
-
-  const [{ opacity }, drag] = useDrag(() => ({
-    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
-    item: createDragItemInfo(columnId, content), // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
-    collect: (monitor) => ({
-      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
-      opacity: monitor.isDragging() ? 0.4 : 1,
-    }),
-  }));

  const handleDeleteCard = () => {
    dispatch({
      type: ActionTypes.DELETE_CARD,
      payload: {
        columnId: columnId,
        cardId: content.id,
      },
    });
  };

  return (
    <div ref={drop}>
      <div ref={ref}>
        <div ref={drag} className={classes.card} style={{ opacity }}>
          {content.title}
          <button onClick={handleDeleteCard}>Borrar</button>
        </div>
      </div>
    </div>
  );
});
```
