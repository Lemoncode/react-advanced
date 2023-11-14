# Lab Business Extract

Seguimos haciendo limpia, en esta caso de business.

## Punto de partida

Si abrimos el fichero de business podemos ver que ese código necesita un poco de cariño, en concreto

```ts
export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanState
): KanbanState => {
  const { columnOriginId, columnDestinationId, content, cardIndex } = moveInfo;
  let newKanbanContent = kanbanContent;

  const columnIndexOrigin = kanbanContent.columns.findIndex(
    (c) => c.id === columnOriginId
  );

  const columnIndexDestination = kanbanContent.columns.findIndex(
    (c) => c.id === columnDestinationId
  );

  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
      // remove
      draft.columns[columnIndexOrigin].content = kanbanContent.columns[
        columnIndexOrigin
      ].content.filter((c) => c.id !== content.id);
      // add
      draft.columns[columnIndexDestination].content.splice(
        cardIndex,
        0,
        content
      );
    });
  }

  return newKanbanContent;
};
```

Este código cuesta de entender, cuando podríamos encapsularlo en dos /tres funciones que lo harían más legible y además... esos helpers igual los podemos usar en otras funciones de este fichero (el de buscar columnas por ejemplo).

## Pistas

- En `movecardColumn` ¿Qué hacemos?
  - Buscamos una columna.
  - Buscamos otra columna.
  - Eliminamos card.
  - Añadimos card.

¿Y si creamos una función por cada funcionalidad?

Y cuando lo tengas repasa el resto de funciones y sabes lo mejor, como tenemos pruebas unitarias podemos ir haciendo estos cambios con menos miedo.

Una vez que hagas ese refactor revisa el resto de métodos.

## Solución

Paso a paso, primero, función de ayudar para buscar una columna:

_./src/kanban/business.ts_

```diff
+ const findColumnIndexById = (columns: Column[], columnId: number) => {
+  return columns.findIndex((c) => c.id === columnId);
+ };
```

Vamos a actualizar _moveCardColumn_

_./src/kanban/business.ts_

```diff
export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanState
): KanbanState => {
  const { columnOriginId, columnDestinationId, content, cardIndex } = moveInfo;
  let newKanbanContent = kanbanContent;

-  const columnIndexOrigin = kanbanContent.columns.findIndex(
-    (c) => c.id === columnOriginId
-  );
+ const columnIndexOrigin = findColumnIndexById(kanbanContent.columns, columnOriginId);

-  const columnIndexDestination = kanbanContent.columns.findIndex(
-    (c) => c.id === columnDestinationId
-  );
+ const columnIndexDestination = findColumnIndexById(kanbanContent.columns, columnDestinationId);

  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
      // remove
      draft.columns[columnIndexOrigin].content = kanbanContent.columns[
        columnIndexOrigin
      ].content.filter((c) => c.id !== content.id);
      // add
      draft.columns[columnIndexDestination].content.splice(
        cardIndex,
        0,
        content
      );
    });
  }

  return newKanbanContent;
};
```

Siguiente paso de simplificación, vamos a encapsular la funcionalidad de eliminar una card de una columna:

> Estos pasos siempre de uno en uno, con pruebas unitarias y probando que no hemos roto nada

_./src/kanban/business.ts_

```diff
+ const removeCardFromColumn = (
+  columnContent: CardContent[],
+  cardId: number
+ ): CardContent[] => columnContent.filter((c) => c.id !== cardId);
```

Y ahora actualizamos _moveCardColumn_

_./src/kanban/business.ts_

```diff
  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
-      // remove
-      draft.columns[columnIndexOrigin].content = kanbanContent.columns[
-        columnIndexOrigin
-      ].content.filter((c) => c.id !== content.id);
+     draft.columns[columnIndexOrigin].content = removeCardFromColumn(
+        kanbanContent.columns[columnIndexOrigin].content,
+        content.id
+      );

      // add
      draft.columns[columnIndexDestination].content.splice(
        cardIndex,
        0,
        content
      );
    });
  }
```

Y ahora a por el add:

_./src/kanban/business.ts_

```diff
+ const mutableInsertCardInColumn = (
+  columnContent: CardContent[],
+  cardIndex: number,
+  content: CardContent
+ ): CardContent[] => {
+  columnContent.splice(cardIndex, 0, content);
+ };
```

```diff
-      draft.columns[columnIndexDestination].content.splice(
-        cardIndex,
-        0,
-        content
-      );

      // add
+      mutableInsertCardInColumn(
+        draft.columns[columnIndexDestination].content,
+        cardIndex,
+        content
+      );
```

Y con este trabajo ya hecho, podemos simplificar _deleteCard_

```diff
export const deleteCard = (
  columnId: number,
  cardId: number,
  kanbanContent: KanbanState
): KanbanState => {
-  // Todo esto se usa también en el moveCard ¿Porque no crear un helper comun?
-  const columnIndex = kanbanContent.columns.findIndex((c) => c.id === columnId);
+ const columnIndex = findColumnIndexById(kanbanContent.columns, columnId);

  if (columnIndex !== -1) {
-    return produce(kanbanContent, (draft) => {
-      draft.columns[columnIndex].content = kanbanContent.columns[
-        columnIndex
-      ].content.filter((c) => c.id !== cardId);
-    });
+   return produce(kanbanContent, (draft) => {
+      draft.columns[columnIndex].content = removeCardFromColumn(
+        kanbanContent.columns[columnIndex].content,
+        cardId
+      );
  }

  return kanbanContent;
};
```

¿Te animas a hacer lo mismo con _moveColumn_?
