# 01 Refactor :)

El ejemplo anterior fue una buena excusa para _pincharnos pan rallao_ y sacar una solución definiendo el área de _drop_ en la columna...

Vamos ahora a cambiar la aproximación y definir cada _card_ como área _drop_ y veremos que el código se simplifica :D.

Partimos del ejemplo anterior.

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-drop-column_.

## Paso a Paso

Vamos a eliminar el drop de la columna:

_./src/kanban/components/column.component.tsx_

```diff
import React from "react";
- import { useDrop } from "react-dnd";
import classes from "./column.component.css";
- import { CardContent, ItemTypes, DragItemInfo } from "../../model";
+ import { CardContent } from "../../model";
import { Card } from "../card/card.component";
- import { KanbanContext } from "../providers/kanban.context";
- import { getArrayPositionBasedOnCoordinates } from "./column.business";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
-  const { moveCard } = React.useContext(KanbanContext);

-  const [collectedProps, drop] = useDrop(() => ({
-    accept: ItemTypes.CARD,
-    drop: (item: DragItemInfo, monitor) => {
-      const index = getArrayPositionBasedOnCoordinates(
-        itemsRef.current,
-        monitor.getClientOffset()
-      );
-
-      moveCard(columnId, index, item);
-
-      return {
-        name: `DropColumn`,
-      };
-    },
-    collect: (monitor: any) => ({
-      isOver: monitor.isOver(),
-      canDrop: monitor.canDrop(),
-    }),
-  }));
-
-  const itemsRef = React.useRef<HTMLDivElement[]>([]);
-
-  itemsRef.current = [];

  return (
-    <div ref={drop} className={classes.container}>
+    <div className={classes.container}>
      <h4>{name}</h4>
-      {content.map((card, idx) => (
+      {content.map((card) => (

        <Card
-          ref={(ref) => (itemsRef.current[idx] = ref)}
          key={card.id}
          columnId={columnId}
          content={card}
        />
      ))}
    </div>
  );
};
```

- Comprobamos que no hemos roto nada :) (bueno el _drop_ no funciona).

```bash
npm start
```

- Vamos a borrar _column.business.ts_

- Vamos ahora a implementar el drop en las card:

_./src/kanban/components/card.component.tsx_

```diff
import React from "react";
- import { useDrag } from "react-dnd";
+ import { useDrag, useDrop } from "react-dnd";
- import { CardContent, ItemTypes, createDragItemInfo } from "../../model";
+ import { CardContent, ItemTypes, createDragItemInfo, DragItemInfo } from "../../model";
+ import { KanbanContext } from "../../providers/kanban.context";
import classes from "./card.component.css";


interface Props {
  content: CardContent;
  columnId: number;
}
```

Vamos a añadir el _useDrop_

_./src/kanban/components/card.component.tsx_

```diff
export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
+ const { moveCard, kanbanContent } = React.useContext(KanbanContext);
// (...)
+  const [_, drop] = useDrop(() => ({
+    accept: ItemTypes.CARD,
+    drop: (item: DragItemInfo, monitor) => {
+      // Esto da error, más abajo cambiamos la firma
+      moveCard(columnId, index, item.content);
+
+      return {
+        name: `DropColumn`,
+      };
+    },
+    collect: (monitor: any) => ({
+      isOver: monitor.isOver(),
+      canDrop: monitor.canDrop(),
+    }),
+  }),
+    [kanbanContent]);

// ...

  return (
+   <div ref={drop}>
      <div ref={ref}>
        <div ref={preview} className={classes.card}>
          <div ref={drag} className={classes.dragHandle} style={{ opacity }} />
          {content.title}
        </div>
      </div>
+   </div>
  );
});
```

- En _Movecard_ tenemos que hacer un _refactor_, vamos a pasarle el id de la _card_ y pasamos a buscar el índice en el contenedor.

_./src/kanban/components/card.component.tsx_

```diff
  const [_, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
-      moveCard(columnId, index, item);
+      moveCard(columnId, content.id, item);
```

Actualizamos _moveCard_

_./src/kanban/providers/kanban.context.ts_

```diff
export interface KanbanContextModel {
  kanbanContent: KanbanContent;
  setKanbanContent: (kanbanContent: KanbanContent) => void;
  moveCard: (
    columnDestinationId: number,
-    index: number,
+    dropCardId: number,
    dragItemInfo: DragItemInfo
  ) => void;
}
```

_./src/providers/kanban.provider.ts_

```diff
  const moveCard = (
    columnDestinationId: number,
-    index: number,
+   dropCardId: number,
    dragItemInfo: DragItemInfo
  ) => {
    const { columnId: columnOriginId, content } = dragItemInfo;

+   // TODO: este código se puede refactorizar
+    const columnDestination = kanbanContent.columns.find(
+      (column) => column.id === columnDestinationId
+    );
+
+    let cardIndex = columnDestination?.content.findIndex(
+      (card) => card.id === dropCardId
+    );
+
+    cardIndex =
+      cardIndex === -1 ? columnDestination?.content.length ?? 0 : cardIndex ?? 0 + 1;
+
    setKanbanContent((kanbanContentLatest) =>
      moveCardColumn(
        {
          columnOriginId,
          columnDestinationId,
-          cardIndex: index,
+          cardIndex: cardIndex ?? 0,
          content,
        },
        kanbanContentLatest
      )
    );
  };
```

- Vamos a probar a ver qué tal funciona :)... pues va bien siempre y cuando soltemos encima de una carta.... Pero ¿qué pasa con el trozo de columna que sale en blanco? Vamos a hacer un truco, en el _column_ aprovechamos que tenemos un _container_ _flexbox_ y vamos a añadir un elemento que ocupa todo el espacio restante y que sea área de _drop_, en cuanto se suelte algo allí le pasamos como _id_ -1 y en _movecard_ añadimos el elemento al final del _array_ (lo marcamos en azul para tenerlo localizado :), después lo eliminaremos).

- Creamos un elemento que llamaremos _EmptySpaceDropZone_

_./src/kanban/components/empty-space-drop-zone.component.tsx_

```tsx
import React from "react";
import { useDrop } from "react-dnd";
import { DragItemInfo, ItemTypes } from "../model";
import { KanbanContext } from "../providers/kanban.context";

interface Props {
  columnId: number;
}

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const { moveCard, kanbanContent } = React.useContext(KanbanContext);

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, _) => {
        moveCard(columnId, -1, item);

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

  return (
    <div
      ref={drop}
      style={{ flexGrow: 1, width: "100%", background: "blue" }}
    />
  );
};
```

_./src/kanban/components/column.component.tsx_

```diff
+ import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
// (...)
  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card, idx) => (
        <Card
          key={card.id}
          columnId={columnId}
          content={card}
        />
      ))}
+     <EmptySpaceDropZone columnId={columnId}/>
    </div>
```

Esto parece que está mejor, pero todavía nos queda un paso más de refactor... vamos a ver como encaja en esta solución _userReducer_
