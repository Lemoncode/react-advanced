# Lab Remove Card

Ahora que lo tenemos todo más o menos organizado toca ir practicando y añadiendo funcionalidad. En este caso vamos a añadir la posibilidad de eliminar una tarjeta.

## Punto de partida

Vamos a partir justo del paso anterior.

Y vamos a añadir un botón en la card para borrarla (no vamos a preocuparnos de look & feel)

En la card añadimos un botón (si después quiere darle con el _martillo fino_ cambialo por un icono y pon un modal para confirmar la acción)

_./src/kanban.components/card/card.component.tsx_

```diff
<div ref={drop}>
  <div ref={ref}>
    <div ref={drag} className={classes.card} style={{ opacity }}>
      {content.title}
+     <button>Borrar</button>
    </div>
  </div>
</div>
```

Vamos hacer un justify del contenido para que hay algo de separación entre el título y el botón:

_./src/kanban.components/card/card.component.module.css_

```diff
.card {
  border: 1px dashed gray; /* TODO: review sizes, colors...*/
  padding: 5px 15px;
  background-color: white;
  width: 210px;
  display: flex;
+ justify-content: space-between;
}
```

## Pistas

¿Que tendríamos que hacer ahora?

1. Nos vamos al model de kanban

_./src/kanban/model.ts_

Y añadimos un nuevo tipo de acción, que será la que nos permita eliminar una tarjeta.

¿Qué payload recibirá?

- Podemos hacer que sólo reciba el cardId y lo busque por todas las columnas.
- Podemos pasarle el columnId y el cardId y buscarlo sólo en esa columna.

Creamos el tipo del payload

2. Para no meter más bombazo de código en kanban.reducer nos vamos al fichero kanban.business.ts y creamos un método que borre una card, pasandole como parametro de entrada su column Id y su cardId

_./src/kanban/kanban.business.ts_

Si queremos podemos añadirle pruebas unitarias

_./src/kanban/kanban.business.spec.ts_

3. Ahora si, nos vamos al reducer y añadimos el case para la nueva acción

_./src/kanban/provider/kanban.reducer.ts_

4. Y por último nos vamos al componente de la card y añadimos el dispatch de la acción y lo asociamos al click del botón

_./src/kanban.components/card/card.component.tsx_

¿Te has fijado que apenas hemos tenido que manchar UI de código?

¿Lo probamos?

## Solución

1. Nos vamos al model de kanban Y añadimos un nuevo tipo de acción, que será la que nos permita eliminar una tarjeta.

_./src/kanban/model.ts_

```diff
export enum ActionTypes {
  SET_KANBAN_CONTENT = "SET_KANBAN_CONTENT",
  MOVE_CARD = "MOVE_CARD",
+ DELETE_CARD = "DELETE_CARD",
}
```

¿Qué payload recibirá?

- Podemos hacer que sólo reciba el cardId y lo busque por todas las columnas.
- Podemos pasarle el columnId y el cardId y buscarlo sólo en esa columna.

2. Creamos el tipo del payload, y lo asociamos con la acción

```diff
export interface MoveCardPayload {
  columnDestinationId: number;
  dropCardId: number;
  dragItemInfo: DragItemInfo;
}

+ export interface DeleteCardPayload {
+   columnId: number;
+   cardId: number;
+ }

export type KanbanAction =
  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
  | {
      type: ActionTypes.MOVE_CARD;
      payload: MoveCardPayload;
-    };
+    }
+ | { type: ActionTypes.DELETE_CARD; payload: DeleteCardPayload };
```

2. Para no meter más bombazo de código en kanban.reducer nos vamos al fichero kanban.business.ts y creamos un método que borre una card, pasandole como parametro de entrada su column Id y su cardId

_./src/kanban/kanban.business.ts_

```tsx
// ...

export const deleteCard = (
  columnId: number,
  cardId: number,
  kanbanContent: KanbanState
): KanbanState => {
  // Todo esto se usa también en el moveCard ¿Porque no crear un helper comun?
  const columnIndex = kanbanContent.columns.findIndex((c) => c.id === columnId);

  if (columnIndex !== -1) {
    return produce(kanbanContent, (draft) => {
      draft.columns[columnIndex].content = kanbanContent.columns[
        columnIndex
      ].content.filter((c) => c.id !== cardId);
    });
  }

  return kanbanContent;
};
```

Si queremos podemos añadirle pruebas unitarias

_./src/kanban/kanban.business.spec.ts_

3. Ahora si, nos vamos al reducer y añadimos el case para la nueva acción

_./src/kanban/provider/kanban.reducer.ts_

```diff
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanState,
  MoveCardPayload,
+ DeleteCardPayload,
} from "../model";
+ import { deleteCard } from "../kanban.business";
// (...)

+ const handleDeleteCard = (
+   state: KanbanState,
+   payload: DeleteCardPayload
+ ): KanbanState =>
+    deleteCard(payload.columnId, payload.cardId, state);


export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanState(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
+  case ActionTypes.DELETE_CARD:
+      return handleDeleteCard(state, action.payload);
    default:
      return state;
  }
};

```

4. Y por último nos vamos al componente de la card y añadimos el dispatch de la acción y lo asociamos al click del botón

_./src/kanban.components/card/card.component.tsx_

```diff
  }));

+  const handleDeleteCard = () => {
+    dispatch({
+      type: ActionTypes.DELETE_CARD,
+      payload: {
+        columnId: columnId,
+        cardId: content.id,
+      },
+    });
+  };

  return (
    <div ref={drop}>
      <div ref={ref}>
        <div ref={drag} className={classes.card} style={{ opacity }}>
          {content.title}
-          <button>Borrar</button>
+          <button onClick={handleDeleteCard}>Borrar</button>
        </div>
      </div>
    </div>
  );

```

¿Lo probamos?
