# Lab Move Columns

Ya movemos cards genial... pero tambíen nos interesa mover columnas.

En este ejercicio nos tiene que rentar todo lo que hemos armado, vamos a verlo.

## Punto de partida

Vamos a partir justo del paso anterior.

Vamos a resaltar las cabeceras de las columnas.

_./src/kanban/components/column/column.component.css_

```diff
 .container {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  align-items: center;
  width: 250px; /* TODO: relative sizes or media queries?*/
  height: 100vh; /* TODO: review height, shouldn't be 100vh*/
  overflow: hidden; /*TODO: scroll? */
  border: 1px solid rgb(4, 1, 19); /* TODO: Theme colors, variables, CSS API? */
  background-color: aliceblue;
}

+ .column-header {
+  display: flex;
+  justify-content: center;
+  align-items: center;
+  width: 100%;
+  height: 30px;
+  padding: 0 5px;
+  background-color: #000080;
+  color: white;
+ }
```

_./src/kanban/components/column/column.component.tsx_

```diff
    <div className={classes.container}>
+      <div className={classes.columnHeader}>
        <h4>{name}</h4>
+      </div>
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
```

## Pistas

Vamos al lío:

- Nos podemos centrar en implementar en business el método para cambiar una columna por otra, podríamos llamarlo `moveColumn` y pasarle dos parámetros `sourceColumnId` y `targetColumnId`, podemos añadir pruebas unitarias para asegurarnos que esté método funciona bien.

- Toca ahora irnos al reducer y su módelo.

  - Podemos crear una acción que se llame MOVE_COLUMN y tipar su payload con un objeto que tenga dos propiedades `sourceColumnId` y `targetColumnId`.

  - En el reducer podemos añadir un case para esta acción y llamar al método `moveColumn` del business.

- Ahora vamos a por el drag:

  - En el componente columna ponemos como draggable la cabecera y le decimos que arrastre toda la columna (esto lo puedes dejar para el final si quieres), cuando arranque el drag pasamos como parámetro el columnId.

- Y ahora a por el drop:
  - En cuanto a la columna le decimos que acepte el drop, y ahí recojemos en que columna de destino hemos caído y lanzamos el dispatch de la acción `MOVE_COLUMN` con el payload adecuado (columnId origen, column Id destino).

## Solución

- Nos podemos centrar en implementar en business el método para cambiar una columna por otra, podríamos llamarlo `moveColumn` y pasarle dos parámetros `sourceColumnId` y `targetColumnId`, podemos añadir pruebas unitarias para asegurarnos que esté método funciona bien.

_./src/kanban/kanban.business.ts_

```diff
- import { CardContent, KanbanState } from "./model";
+ import { CardContent, Column, KanbanState } from "./model";
import { produce } from "immer";

+ // añadir al final (habría que renombrar MoveInfo a MoveCardInfo)

+ export interface MoveColumnInfo = {
+   sourceColumnId: number;
+   targetColumnId: number;
+ }
+
+ // TODO: habría que cubrir casos arista (id no encontrado etc...)
+ export const moveColumn = (columns: Column[], { sourceColumnId, targetColumnId }: MoveColumnInfo): Column[] => {
+   const sourceColumnIndex = columns.findIndex((column) => column.id === sourceColumnId);
+   const targetColumnIndex = columns.findIndex((column) => column.id === targetColumnId);
+
+   const sourceColumn = columns[sourceColumnIndex];
+   const targetColumn = columns[targetColumnIndex];
+
+   const newColumns = [...columns];
+   newColumns[sourceColumnIndex] = targetColumn;
+   newColumns[targetColumnIndex] = sourceColumn;
+  return newColumns;
+ }
```

Le añadimos pruebas unitarias:

_./src/kanban/kanban.business.spec.ts_

```diff
- import { moveCardColumn } from "./kanban.business";
+ import { moveCardColumn, moveColumn } from "./kanban.business";

+ describe('moveColumn', () => {
+   it('should move column', () => {
+     // Arrange
+     const columns = [
+       { id: 1, name: 'TODO', content: [] },
+       { id: 2, name: 'DOING', content: [] },
+       { id: 3, name: 'DONE', content: [] },
+     ];
+
+     // Act
+     const result = moveColumn(columns, { sourceColumnId: 1, targetColumnId: 3 });
+
+     // Assert
+     expect(result).toEqual([
+       { id: 3, name: 'DONE', content: [] },
+       { id: 2, name: 'DOING', content: [] },
+       { id: 1, name: 'TODO', content: [] },
+     ]);
+   });
+ });
```

- Toca ahora irnos al reducer y su módelo.

  - Podemos crear una acción que se llame MOVE_COLUMN y tipar su payload con un objeto que tenga dos propiedades `sourceColumnId` y `targetColumnId`.

_./src/model.ts_

```diff
export const ItemTypes = {
  CARD: "card",
+ COLUMN: "column",
};

// (...)

export enum ActionTypes {
  SET_KANBAN_CONTENT = "SET_KANBAN_CONTENT",
  MOVE_CARD = "MOVE_CARD",
  DELETE_CARD = "DELETE_CARD",
+ MOVE_COLUMN = "MOVE_COLUMN",
}
```

```diff
export interface DeleteCardPayload {
  columnId: number;
  cardId: number;
}

+ export interface MoveColumnPayload {
+   sourceColumnId: number;
+   targetColumnId: number;
+ }

export type KanbanAction =
  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
  | {
      type: ActionTypes.MOVE_CARD;
      payload: MoveCardPayload;
    }
-  | { type: ActionTypes.DELETE_CARD; payload: DeleteCardPayload };
+  | { type: ActionTypes.DELETE_CARD; payload: DeleteCardPayload }
+ | { type: ActionTypes.MOVE_COLUMN; payload: MoveCardPayload };
```

- En el reducer podemos añadir un case para esta acción y llamar al método `moveColumn` del business.

_./src/providers/kanban.reducer.ts_

```diff
- import { moveCardColumn, deleteCard } from "../kanban.business";
+ import { moveCardColumn, deleteCard, moveColumn } from "../kanban.business";
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanState,
  MoveCardPayload,
  DeleteCardPayload,
+ MoveColumnPayload,
} from "../model";
```

```diff
const handleDeleteCard = (
  state: KanbanState,
  payload: DeleteCardPayload
): KanbanState => deleteCard(payload.columnId, payload.cardId, state);

+ const handleMoveColumn = (
+   state: KanbanState,
+   payload: MoveColumnPayload
+ ): KanbanState => ({
+   ...state,
+   columns: moveColumn(state.columns, payload),
+ });

export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanState(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
    case ActionTypes.DELETE_CARD:
      return handleDeleteCard(state, action.payload);
+  case ActionTypes.MOVE_COLUMN:
+      return handleMoveColumn(state, action.payload);
    default:
      return state;
  }
};

```

- En el reducer podemos añadir un case para esta acción y llamar al método `moveColumn` del business.

- Ahora vamos a por el drag:

  - En el componente columna ponemos como draggable la cabecera y le decimos que arrastre toda la columna (esto lo puedes dejar para el final si quieres), cuando arranque el drag pasamos como parámetro el columnId.

Primero actualizar el modelo:

_./src/kanban/components/column/column.component.tsx_

```diff
import React from "react";
+ import { useDrag } from "react-dnd";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import classes from "./column.component.module.css";
- import { CardContent } from "../../model";
+ import { CardContent, ItemTypes } from "../../model";
import { Card } from "../card/card.component";
```

```diff
export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;

+  const [{ opacity }, drag] = useDrag(() => ({
+    type: ItemTypes.COLUMN, // Definimos que es de tipo CARD esto lo usaremos en el drop
+    item: { columnId }, // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
+    collect: (monitor) => ({
+      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
+      opacity: monitor.isDragging() ? 0.4 : 1,
+    }),
+  }));

  return (
-    <div className={classes.container}>
+    <div className={classes.container} ref={drag} style={{opacity}}>

      <div className={classes.columnHeader}>
        <h4>{name}</h4>
      </div>
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
```

Podemos probar a arrastrar...

Ya sólo nos queda hacer el drop:

_./src/kanban/components/column/column.component.tsx_

```diff
import React from "react";
- import { useDrag } from "react-dnd";
+ import { useDrag, useDrop } from "react-dnd";
+ import { useKanbanContext } from"../../providers/kanban.context";;
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import classes from "./column.component.module.css";
- import { CardContent, ItemTypes } from "../../model";
+ import { ActionTypes, CardContent, ItemTypes } from "../../model";
import { Card } from "../card/card.component";
```

```diff
export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
+ const { kanbanContent, dispatch } = useKanbanContext();

// (...)

+  const [_, drop] = useDrop(
+    () => ({
+      accept: ItemTypes.COLUMN,
+      drop: (item: { columnId: number }, _) => {
+        dispatch({
+          type: ActionTypes.MOVE_COLUMN,
+          payload: {
+            sourceColumnId: item.columnId,
+            targetColumnId: columnId,
+          },
+        });
+
+        return {
+          name: `DropColumn`,
+        };
+      },
+      collect: (monitor: any) => ({
+        isOver: monitor.isOver(),
+        canDrop: monitor.canDrop(),
+      }),
+    }),
+    [kanbanContent]
+  );
```

```diff
  return (
    <div className={classes.container} ref={drag} style={{ opacity }}>
-      <div className={classes.columnHeader}>
+      <div className={classes.columnHeader} ref={drop}>
        <h4>{name}</h4>
      </div>
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
```
