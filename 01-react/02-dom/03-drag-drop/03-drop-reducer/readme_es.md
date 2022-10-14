# 01 useReducer

## Resumen

Ya hemos usado el contexto para tener más organizada nuestra aplicación y
evitar acabar con un prop drill, vamos a darle una vuelta de tuerca más
y aplicar useReducer a esta solución, el resultado lo evaluaremos y me
diréis si merece la pena aplicar useReducer en este caso.

## Paso a Paso

Partimos del ejemplo anterior.

Este ejemplo toma como punto de partida el ejemplo _02-drop-column_.

- El reduce lo vamos a usar dentro del contexto de Kanban, para tenerlo
  cerca vamos a crearlo dentro de la carpeta de providers (la localización de
  este fichero es discutible))

- Vamos a hacer un refactor, en model vamos a renombrar _KanbanContent_
  a _KanbanState_

_./src/kanban/model.ts_

** Refactor con VSCode KanbanContent a KanbanState **

Aprovechamos el KanbanModel para añadir:

- Enumerado de acciones en este caso incializar el kanban de cards,
  y mover una card de una columna a otra.

- Añadimos enumerado con los action types.

- Añadimos interfaz con los payload.

(añadir al final)
_./src/kanban/model.ts_

```ts
export const ItemTypes = {
  CARD: "card",
};

export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  id: number;
  name: string;
  content: CardContent[];
}

export interface KanbanState {
  columns: Column[];
}

export enum ActionTypes {
  SET_KANBAN_CONTENT = "SET_KANBAN_CONTENT",
  MOVE_CARD = "MOVE_CARD",
}

export interface MoveCardPayload {
  columnDestinationId: number;
  dropCardId: number;
  dragItemInfo: DragItemInfo;
}

export type KanbanAction =
  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
  | {
      type: ActionTypes.MOVE_CARD;
      payload: MoveCardPayload;
    };
//  | { type: 'drag'; payload: { from: string; to: string }

export const createDefaultKanbanContent = (): KanbanState => ({
  columns: [],
});

export interface DragItemInfo {
  columnId: number;
  content: CardContent;
}

export const createDragItemInfo = (
  columnId: number,
  content: CardContent
): DragItemInfo => ({
  columnId,
  content: content,
});
```

- Creamos el fichero _kanban.reducer.ts_ dentro de la carpeta _providers_.

_./src/kanban/providers/kanban.reducer.ts_

```typescript
import { moveCardColumn } from "../kanban.business";
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanContent,
  MoveCardPayload,
} from "../model";

const handleSetKanbanContent = (state, newKanbanContent) => {
  return newKanbanContent;
};

const handleMoveCard = (
  state: KanbanState,
  moveCardPayload: MoveCardPayload
): KanbanState => {
  const { columnDestinationId, dragItemInfo, dropCardId } = moveCardPayload;
  const { columnId: columnOriginId, content } = dragItemInfo;

  const columnDestination = state.columns.find(
    (column) => column.id === columnDestinationId
  );

  let cardIndex = columnDestination?.content.findIndex(
    (card) => card.id === dropCardId
  );

  cardIndex =
    cardIndex === -1 ? columnDestination.content.length : cardIndex + 1;

  return moveCardColumn(
    {
      columnOriginId,
      columnDestinationId,
      cardIndex,
      content,
    },
    state
  );
};

export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanContent(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
    default:
      return state;
  }
};
```

- Una cosa buena de esto es que si lo tenemos claro podríamos
  haber arrancado por TDD, en este caso vamos a meter un par de
  pruebas unitarias para ver que vamos por el buen camino
  (en un caso real habría que trabajar esto más).

_./src/kanban/providers/kanban.reducer.spec.ts_

```ts
import { moveCardColumn } from "../kanban.business";
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanContent,
  MoveCardPayload,
} from "../model";

const handleSetKanbanContent = (state, newKanbanContent) => {
  return newKanbanContent;
};

const handleMoveCard = (
  state: KanbanState,
  moveCardPayload: MoveCardPayload
): KanbanState => {
  const { columnDestinationId, dragItemInfo, dropCardId } = moveCardPayload;
  const { columnId: columnOriginId, content } = dragItemInfo;

  const columnDestination = state.columns.find(
    (column) => column.id === columnDestinationId
  );

  let cardIndex = columnDestination?.content.findIndex(
    (card) => card.id === dropCardId
  );

  cardIndex =
    cardIndex === -1 ? columnDestination.content.length : cardIndex + 1;

  return moveCardColumn(
    {
      columnOriginId,
      columnDestinationId,
      cardIndex,
      content,
    },
    state
  );
};

export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanContent(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
    default:
      return state;
  }
};
```

- Realizamos sustitución en _KanbanContext_

_./src/kanban/providers/kanban.context.tsx_

```diff
import React from "react";
import {
  createDefaultKanbanContent,
  DragItemInfo,
  KanbanState,
+ KanbanAction
} from "../model";

+ import { kanbanReducer } from "./kanban.reducer";
```

_./src/kanban/providers/kanban.context.tsx_

```diff
export interface KanbanContextModel {
-  kanbanContent: KanbanState;
-  setKanbanContent: (kanbanContent: KanbanState) => void;
-  moveCard: (
-    columnDestinationId: number,
-    dropCardId: number,
-    dragItemInfo: DragItemInfo
-  ) => void;
+ kanbanContent: KanbanState;
+ dispatch: React.Dispatch<KanbanAction>;
}

export const KanbanContext = React.createContext<KanbanContextModel>(
+  null
-  {
-  kanbanContent: createDefaultKanbanContent(),
-  setKanbanContent: () =>
-    console.warn(
-      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
-    ),
-  moveCard: () => null,
-}
);
```

- Vamos a realizar sustitución en el componente KanbanProvider:

_./src/kanban/providers/kanban.provider.tsx_

```diff
import React from "react";
- import { moveCardColumn } from "../kanban.business";
- import {
-  KanbanState,
-  createDefaultKanbanContent,
-  DragItemInfo,
- } from "../model";
import { KanbanContext } from "./kanban.context";
+ import { kanbanReducer } from "./kanban.reducer";
```

```diff
export const KanbanProvider: React.FC<Props> = ({ children }) => {
-  const [kanbanContent, setKanbanContent] = React.useState<KanbanState>(
-    createDefaultKanbanContent()
-  );
+  const [kanbanContent, dispatch] = React.useReducer(kanbanReducer, createDefaultKanbanContent());

-  const moveCard = (
-    columnDestinationId: number,
-    dropCardId: number,
-    dragItemInfo: DragItemInfo
-  ) => {
-    const { columnId: columnOriginId, content } = dragItemInfo;
-
-    // TODO: este código se puede refactorizar
-    const columnDestination = kanbanContent.columns.find(
-      (column) => column.id === columnDestinationId
-    );
-
-    let cardIndex = columnDestination?.content.findIndex(
-      (card) => card.id === dropCardId
-    );
-
-    cardIndex =
-      cardIndex === -1 ? columnDestination.content.length : cardIndex + 1;
-
-    setKanbanContent((kanbanContentLatest) =>
-      moveCardColumn(
-        {
-          columnOriginId,
-          columnDestinationId,
-          cardIndex,
-          content,
-        },
-        kanbanContentLatest
-      )
-    );
-  };

  return (
    <KanbanContext.Provider
      value={{
        kanbanContent,
+       dispatch
-        setKanbanContent,
-        moveCard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
```

- Vamos ahora a adapta el container para que use el _dispatch_

_./src/kanban/containers/kanban.container.tsx_

```diff
import React from "react";
- import { DragItemInfo } from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
+ import { ActionTypes } from "./model";
import { KanbanContext } from "./providers/kanban.context";
```

_./src/kanban/containers/kanban.container.tsx_

```diff
export const KanbanContainer: React.FC = () => {
-  const { kanbanContent, setKanbanContent, moveCard } =
+  const { kanbanContent, dispatch } =
    React.useContext(KanbanContext);

  React.useEffect(() => {
-    loadKanbanContent().then((content) => setKanbanContent(content));
+    loadKanbanContent().then((content) =>
+       dispatch({ type: ActionTypes.SET_KANBAN_CONTENT, payload: content }));
  }, []);

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          name={column.name}
          content={column.content}
        />
      ))}
    </div>
  );
};
```

Y ahora vamos a actualizar el card container:

_./src/kanban/components/card.component.tsx_

```diff
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  CardContent,
  ItemTypes,
  createDragItemInfo,
  DragItemInfo,
+  ActionTypes,
} from "../model";
```

_./src/kanban/components/card.component.tsx_

```diff
export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
-  const { moveCard, kanbanContent } = React.useContext(KanbanContext);
+  const { kanbanContent, dispatch } = React.useContext(KanbanContext);

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content),
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del
      // card que está fijo (el elegido para el drag, para que el usuario se de cuenta)
      // de que item está arrastrando
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  const [collectedProps, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, monitor) => {
-        moveCard(columnId, content.id, item);
+        dispatch({
+          type: ActionTypes.MOVE_CARD,
+          payload: {
+            columnDestinationId: columnId,
+            dropCardId: content.id,
+            dragItemInfo: item,
+          },
+        });

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
    <div ref={drop}>
      <div ref={ref}>
        <div ref={preview} className={classes.card}>
          <div ref={drag} className={classes.dragHandle} style={{ opacity }} />
          {content.title}
        </div>
      </div>
    </div>
  );
});
```

- Vale el drag entre cards perfecto, nos queda el drag cuando suelto en el espacio
libre de una columna:


