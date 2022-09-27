# 01 Refactor :)

El ejemplo anterior fue una buena excusa para _pincharnos pan rallao_ y sacar una solución definiendo el área de drop
en la columna...

Vamos ahora a cambiar la aproximación y definir cada card como área drop y veremos que el código se simplifica :D.

Partimos del ejemplo anterior.

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-drop-column_.

## Paso a Paso

Vamos a eliminar el drop de la columna:

_./src/kanban/components/column.tsx_

```diff
import React from "react";
- import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
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
      {content.map((card, idx) => (
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

- Comprobamos que no hemos roto nada :) (bueno el drop no funciona).

```bash
npm start
```

- Vamos a borrar _column.business.ts_

- Vamos ahora a implementar el drop en las card:

_./src/kanban/components/cards.tsx_

```diff
import React from "react";
- import { useDrag } from "react-dnd";
+ import { useDrag, useDrop } from "react-dnd";
- import { CardContent, ItemTypes, createDragItemInfo } from "../model";
+ import { CardContent, ItemTypes, createDragItemInfo, DragItemInfo } from "../model";
import classes from "./card.component.css";
+ import { KanbanContext } from "../providers/kanban.context";

interface Props {
  content: CardContent;
  columnId: number;
}
```

Vamos a añadir el useDrop

_./src/kanban/components/cards.tsx_

```diff
export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
+ const { moveCard } = React.useContext(KanbanContext);
// (...)
+  const [collectedProps, drop] = useDrop(() => ({
+    accept: ItemTypes.CARD,
+    drop: (item: DragItemInfo, monitor) => {
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
+  }));

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

- En Movecard tenemos que hacer un refactor, vamos a pasarle el id de la
  card y pasamos a buscar el indice en el contenedor.

_./src/kanban/components/cards.tsx_

```diff
  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
-      moveCard(columnId, index, item);
+      moveCard(columnId, content.id, item);
```

Actualizamos _moveCard_

_./src/providers/kanban.context.ts_

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
+    const cardOrigin = columnDestination?.content.find(
+      (card) => card.id === dropCardId
+    );
+
+    const cardIndex = cardOrigin?.id;

    setKanbanContent((kanbanContentLatest) =>
      moveCardColumn(
        {
          columnOriginId,
          columnDestinationId,
-          cardIndex: index,
+          cardIndex,
          content,
        },
        kanbanContentLatest
      )
    );
  };
```

- Vamos a probar a ver que tal funciona :)... pues va bien siempre y cuando
soltemos encima de una carta.... Pero que pasa el trozo de columna que sale
en blanco? Vamos a hacer un truco
