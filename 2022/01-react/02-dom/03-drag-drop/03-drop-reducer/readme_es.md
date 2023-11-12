# 01 useReducer

## Resumen

Ya hemos usado el contexto para tener más organizada nuestra aplicación y
evitar acabar con un _prop drill_, vamos a darle una vuelta de tuerca más
y aplicar _useReducer_ a esta solución, el resultado lo evaluaremos y me
diréis si merece la pena aplicar _useReducer_ en este caso.

## Paso a Paso

Partimos del ejemplo anterior.

Este ejemplo toma como punto de partida el ejemplo _02-drop-column_.

- El _reduce_ lo vamos a usar dentro del contexto de _Kanban_, para tenerlo
  cerca vamos a crearlo dentro de la carpeta de providers (la localización de
  este fichero es discutible))

- Vamos a hacer un _refactor_, en _model_ vamos a renombrar _KanbanContent_
  a _KanbanState_

_./src/kanban/model.ts_

** Refactor con VSCode _KanbanContent_ a _KanbanState_ **
F2 rename !!

Lo mismo con _createDefaultKanbanContent_ a _createDefaultKanbanState_

Aprovechamos el fichero _KanbanModel_ para añadir:

- Enumerado de acciones en este caso incializar el _kanban_ de cards,
  y mover una card de una columna a otra.

- Añadimos enumerado con los _action types_.

- Añadimos interfaz con los _payload_.

(añadir al final)
_./src/kanban/model.ts_

```diff
 export interface KanbanState {
  columns: Column[];
}

export const createDefaultKanbanState = (): KanbanState => ({
  columns: [],
});

+ export enum ActionTypes {
+  SET_KANBAN_CONTENT = "SET_KANBAN_CONTENT",
+  MOVE_CARD = "MOVE_CARD",
+ }
+
+ export interface MoveCardPayload {
+  columnDestinationId: number;
+  dropCardId: number;
+  dragItemInfo: DragItemInfo;
+ }
+
+ export type KanbanAction =
+  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
+  | {
+      type: ActionTypes.MOVE_CARD;
+      payload: MoveCardPayload;
+    };
//  | { type: 'drag'; payload: { from: string; to: string }
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

const handleSetKanbanContent = (
  _: KanbanState,
  newKanbanState: KanbanState
) => {
  return newKanbanState;
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
    cardIndex === -1
      ? columnDestination?.content.length ?? 0
      : cardIndex ?? 0 + 1;

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

- Una cosa buena de esto es que si lo tenemos claro podríamos haber arrancado por TDD, en este caso vamos a meter un par de pruebas unitarias para ver que vamos por el buen camino (en un caso real habría que trabajar esto más).

_./src/kanban/providers/kanban.reducer.spec.ts_

```ts
import { KanbanState, ActionTypes, createDefaultKanbanState } from "../model";
import { kanbanReducer } from "./kanban.reducer";

describe("KanbanReducer", () => {
  it("should handle SET_KANBAN_CONTENT", () => {
    const initialState: KanbanState = createDefaultKanbanState();

    const state: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    };

    const newState = kanbanReducer(initialState, {
      type: ActionTypes.SET_KANBAN_CONTENT,
      payload: state,
    });

    expect(newState).toEqual(state);
  });

  it("should handle MOVE_CARD from column 1 to column 2", () => {
    const initialState: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
        {
          id: 2,
          name: "Column 2",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const state: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [],
        },
        {
          id: 2,
          name: "Column 2",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const newState = kanbanReducer(initialState, {
      type: ActionTypes.MOVE_CARD,
      payload: {
        columnDestinationId: 2,
        dropCardId: 2,
        dragItemInfo: {
          columnId: 1,
          content: {
            id: 1,
            title: "Card 1",
          },
        },
      },
    });
    expect(newState).toEqual(state);
  });
});
```

- Realizamos sustitución en _KanbanContext_

_./src/kanban/providers/kanban.context.tsx_

```diff
import React from "react";
import {
-  createDefaultKanbanContent,
-  DragItemInfo,
-  KanbanContent,
+  KanbanState,
+  KanbanAction
} from "../model";
```

_./src/kanban/providers/kanban.context.tsx_

```diff
export interface KanbanContextProps {
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

- export const KanbanContext = React.createContext<KanbanContextModel>(
+ export const KanbanContext = React.createContext<KanbanContextModel |null>(
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

- Vamos a realizar sustitución en el componente _KanbanProvider_:

_./src/kanban/providers/kanban.provider.tsx_

```diff
import React from "react";
- import { moveCardColumn } from "../kanban.business";
  import {
-  KanbanState,
   createDefaultKanbanContent,
-  DragItemInfo,
  } from "../model";
import { KanbanContext } from "./kanban.context";
+ import { kanbanReducer } from "./kanban.reducer";
```

```diff
export const KanbanProvider: React.FC<Props> = ({ children }) => {
-  const [kanbanContent, setKanbanContent] = React.useState<KanbanState>(
-    createDefaultKanbanContent()
-  );
+  const [kanbanContent, dispatch] = React.useReducer(kanbanReducer, createDefaultKanbanState());

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

- Vamos ahora a adaptar el _container_ para que use el _dispatch_

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
- import { DragItemInfo } from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
+ import { ActionTypes } from "./model";
import { KanbanContext } from "./providers/kanban.context";
```

_./src/kanban/kanban.container.tsx_

```diff
export const KanbanContainer: React.FC = () => {
-  const { kanbanContent, setKanbanContent, moveCard } =
+  const { kanbanContent, dispatch } =
+    useKanbanContext();

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

Y ahora vamos a actualizar el _card component_:

_./src/kanban/componentes/card.component.tsx_

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
+  const { kanbanContent, dispatch } = useKanbanContext();

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

- Vale el _drag_ entre _cards_ perfecto, nos queda el _drag_ cuando suelto en el espacio
  libre de una columna:

_./src/kanban/components/empty-space-drop-zone.tsx_

```diff
import React from "react";
import { useDrop } from "react-dnd";
- import { DragItemInfo, ItemTypes } from "../model";
+ import { DragItemInfo, ItemTypes, ActionTypes } from "../model";
import { KanbanContext } from "../providers/kanban.context";
```

_./src/kanban/components/empty-space-drop-zone.tsx_

```diff
export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
-  const { moveCard, kanbanContent } = React.useContext(KanbanContext);
+ const { kanbanContent, dispatch } = useKanbanContext();

  const [collectedProps, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, monitor) => {
-        moveCard(columnId, -1, item);
+       dispatch({
+         type: ActionTypes.MOVE_CARD,
+         payload: {
+           columnDestinationId: columnId,
+           dropCardId: -1,
+           dragItemInfo: item,
+         },
+       });

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
```

# Ejercicio

Vamos a práctica con _useReducer_:

- Añadimos un botón al _card_ para borrar un _card_.
- Esa acción la creamos en el _use reducer_.
- Lo conectamos todo.

****

Labs

Borrar una card

Mover columnas?
Con pistas aquí


Refactor Card

Vaciar business