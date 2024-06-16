# Ejercicio drag / drop de columnas

Vamos ahora a permtir hacer drag and drop de columnas, para ello vamos a tener que modificar el ejercicio anterior.

## A tener en cuenta

1. Lo primero es saber que estamos arrastrando, vamos a añadir un campo para identificar si arrastramos `'card'|'column'` eso lo empezamos a usar en el drag y drop del card (si no me viene de tipo `card` lo ignoro).

2. Vamos a crear el area de drag para la columna y le indicamos que es de tipo de elemento que arrastramos (column), y el `id`de la columna ¡ojo aquí¡ una cosa el lo que va a disparar el drag y otra que querramos arrastra la columna completa.

3. En el columna tambien tendremos drop, mirarmos si lo que estamos haciendo drop es de tipo `column` si no lo ignoro.

4. En el monitor, chequeo que se está soltando (ya el drop hizo el check de que el matching de elemento origen y destino es bueno y hago el cambio)

## Paso a paso

Primero vamos al card component, y añadir en el drag el tipo de elemento que estoy arrastrando:

_./src/kanban/components/card/card.component.tsx_

```diff
  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
-      getInitialData: () => ({ dragType: 'CARD',card: content }),
+      getInitialData: () => ({ dragType: 'CARD',card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);
```

Ahora en el drop vamos a comprobar que el tipo de elemento que estamos arrastrando es `drop` y si no lo es lo ignoramos:

_./src/kanban/components/card/card.component.tsx_

```diff
  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData:  () => ({ columnId, cardId: content.id }),
+      canDrop: ({source}) => source.data.dragType === 'CARD',
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);
```

Vamos a por las columnas:

- Nos traemos los imports que hagan falta:

_./src/kanban/components/column/column.component.tsx_

```diff
+ import { useEffect, useRef, useState } from "react";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
+ import {
+  draggable,
+  dropTargetForElements,
+ } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
+ import invariant from "tiny-invariant";
```

Creamos un `ref` a la column y lo enlazamos en el elemento de HTML

_./src/kanban/components/column/column.component.tsx_

```diff
export const Column: React.FC<Props> = (props) => {
+  const ref = useRef(null);
  const { name, content, columnId } = props;
```

```diff
  return (
    <div
      className={classes.container}
      style={{ background: calculateBackgroundColor() }}
+      ref={ref}
    >
      <div>
        <h4>{name}</h4>
      </div>
```

Vamos a dar feedback visual de que una columna se está arrastrando y donde se suelta (después lo añadiremos al drag/drop y al markup):

_./src/kanban/components/column/column.component.tsx_

```diff
export const Column: React.FC<Props> = (props) => {
  const ref = useRef(null);
  const { name, content, columnId } = props;
+  const [dragging, setDragging] = useState<boolean>(false);
+  const [isDraggedOver, setIsDraggedOver] = useState(false);
```

Vamos ahora a definir la columna como draggable indicandole en el dragType que va a ser `COLUMN`:

```diff
const [isDraggedOver, setIsDraggedOver] = useState(false);

+  useEffect(() => {
+    const el = ref.current;
+
+    invariant(el);
+
+    return draggable({
+      element: el,
+      getInitialData: () => ({ dragType: "COLUMN", columnOriginId: columnId }),
+      onDragStart: () => setDragging(true),
+      onDrop: () => setDragging(false),
+    });
+  }, []);
```

> Si quisiera hacer el arrastra con un handlePragmatic drag and drop tiene dos entradas (`element: HTMLElement` y `dragHandle` ) https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/element/about

Vamos ahora a por el drop, en este caso comprobamos que lo que se está arrastrando es una columna y si es así paaalante:

_./src/kanban/components/column/column.component.tsx_

```diff
  }, []);

+  useEffect(() => {
+    const el = ref.current;
+    invariant(el);
+
+    return dropTargetForElements({
+      element: el,
+      getData: () => ({ ColumnDestinationId: columnId }),
+      canDrop: ({ source }) => source.data.dragType === "COLUMN",
+      onDragEnter: () => setIsDraggedOver(true),
+      onDragLeave: () => setIsDraggedOver(false),
+      onDrop: () => setIsDraggedOver(false),
+    });
+  }, []);
```

Vamos añadir una función de ayuda para que nos pinte el feedback visual de que estamos arrastrando la columna o soltandola:

_./src/kanban/components/column/column.component.tsx_

```diff
+  const calculateBackgroundColor = () => {
+    if (dragging) {
+      return "white";
+    }
+    if (isDraggedOver) {
+      return "lightblue";
+    }
+    return "aliceblue";
+  };

  return (
    <div
      className={classes.container}
+      style={{ background: calculateBackgroundColor() }}
      ref={ref}
    >
```

Ahora nos queda el `monitor`, lo tenemos que refactorizar ahora tenemos dos casos card y column.

Lo primero añadir un método de negocio para hacer swap entre dos columnas:

** Añadir al final **

_./src/kanban/kanban.container.business.ts_

```ts
export const moveColumn = (
  columnOriginId: number,
  columnDestinationId: number,
  kanbanContent: KanbanContent
): KanbanContent => {
  return produce(kanbanContent, (draft) => {
    const originIndex = draft.columns.findIndex(
      (column) => column.id === columnOriginId
    );
    const destinationIndex = draft.columns.findIndex(
      (column) => column.id === columnDestinationId
    );

    const [removed] = draft.columns.splice(originIndex, 1);
    draft.columns.splice(destinationIndex, 0, removed);
  });
};
```

Y en el container vamos a romper el subfunciones por que el monitor se complica (tenemos dos casos):

_./src/kanban/kanban.container.tsx_

```diff
- import { moveCard } from "./kanban.container.business";
+ import { moveCard, moveColumn } from "./kanban.container.business";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
import { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import classes from "./kanban.container.module.css";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

+  const dropCard = (
+    source: ElementDragPayload,
+    destination: DropTargetRecord
+  ) => {
+    const card = source.data.card as CardContent;
+    const columnId = destination.data.columnId as number;
+    const destinationCardId = destination.data.cardId as number;
+
+    // También aquí nos aseguramos de que estamos trabajando con el último estado
+    setKanbanContent((kanbanContent) =>
+      moveCard(card, { columnId, cardId: destinationCardId }, kanbanContent)
+    );
+  };
+
+  const dropColumn = (
+    source: ElementDragPayload,
+    destination: DropTargetRecord
+  ) => {
+    const columnOriginId = source.data.columnOriginId as number;
+    const columnDestinationId = destination.data.ColumnDestinationId as number;
+
+    // También aquí nos aseguramos de que estamos trabajando con el último estado
+    setKanbanContent((kanbanContent) =>
+      moveColumn(columnOriginId, columnDestinationId, kanbanContent)
+    );
+  };
+
+  const isDropCard = (source: ElementDragPayload) => {
+    return source.data.dragType === "CARD";
+  };
+
+  const isDropColumn = (source: ElementDragPayload) => {
+    return source.data.dragType === "COLUMN";
+  };

  React.useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // si se suelta fuera de cualquier target
          return;
        }

+        if (isDropCard(source)) {
+          dropCard(source, destination);
+        }
+
+        if (isDropColumn(source)) {
+          dropColumn(source, destination);
+        }

-        const card = source.data.card as CardContent;
-        const columnId = destination.data.columnId as number;
-        const destinationCardId = destination.data.cardId as number;
-
-        // También aquí nos aseguramos de que estamos trabajando con el último estado
-        setKanbanContent((kanbanContent) =>
-          moveCard(card, { columnId, cardId: destinationCardId }, kanbanContent)
-        );
      },
    });
  }, [kanbanContent]);

  return (
```

Vamos a probarlo:

```bash
npm run dev
```

## Refactor

Se nos ha quedado un bombazo de código en los componetes, hora de hacer limpia y refactorizar a negocio o custom hooks.

Vamos a empezar por el `kanbanContainer`, aquí que tenemos:

- Un funciondalida bien definida que es la de monitorizar y hacer drop.
- ¿Qué dependencias tiene? En principio dos, el `kanbanContainer` (se usa en el `useEffect`) `setKanbanContent` (se usa en el drop).

Podríamos:

- Sacar un hook para drag, otro para drop y dejar el monitor en el container.
- Sacar un hook con el drag y el drop y dejar el monitor en el container.
- Sacar un hook con drag, drop y monitor.
- Sacar toda la lógica del componente a un hook.

La cuarta opción la descartamos, no deja de ser "mover toda la mierda" a otro sitio.

Y dándole una pensada, tendría sentido aislar toda la monitirización es un hook:

- Encpasulamos toda esa funcionalidad y está relacionada.
- Sólo tendríamos que pasarle por parametro el `setKanbanContent`.
- Podemos darle un nombre que sea descriptivo, por ejemplo `useKanbanMonitor` que no deja ser una especialización de la funcion `monitorForElements`.

Vamos a darle caña:

_./src/kanban/kanban-monitor.hook.tsx_

```tsx
import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent, KanbanContent } from "../model";
import { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { moveCard, moveColumn } from "../kanban.container.business";
import React from "react";

// Esto podría ir en business
const isDropCard = (source: ElementDragPayload) => {
  return source.data.dragType === "CARD";
};

const isDropColumn = (source: ElementDragPayload) => {
  return source.data.dragType === "COLUMN";
};

export const useKanbanMonitor = (
  kanbanContent: KanbanContent,
  setKanbanContent: (value: React.SetStateAction<KanbanContent>) => void
) => {
  const dropCard = (
    source: ElementDragPayload,
    destination: DropTargetRecord
  ) => {
    const card = source.data.card as CardContent;
    const columnId = destination.data.columnId as number;
    const destinationCardId = destination.data.cardId as number;

    // También aquí nos aseguramos de que estamos trabajando con el último estado
    setKanbanContent((kanbanContent) =>
      moveCard(card, { columnId, cardId: destinationCardId }, kanbanContent)
    );
  };

  const dropColumn = (
    source: ElementDragPayload,
    destination: DropTargetRecord
  ) => {
    const columnOriginId = source.data.columnOriginId as number;
    const columnDestinationId = destination.data.ColumnDestinationId as number;

    // También aquí nos aseguramos de que estamos trabajando con el último estado
    setKanbanContent((kanbanContent) =>
      moveColumn(columnOriginId, columnDestinationId, kanbanContent)
    );
  };

  React.useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // si se suelta fuera de cualquier target
          return;
        }

        if (isDropCard(source)) {
          dropCard(source, destination);
        }

        if (isDropColumn(source)) {
          dropColumn(source, destination);
        }
      },
    });
  }, [kanbanContent]);
};
```

Y ahora en el container:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
- import {
-  ElementDragPayload,
-  monitorForElements,
- } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
-  CardContent,
  KanbanContent,
  createDefaultKanbanContent,
} from "./model";
import { loadKanbanContent } from "./api";
- import { moveCard, moveColumn } from "./kanban.container.business";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
- import { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
+ import { useKanbanMonitor } from "./kanban-monitor.hook";
```

```diff
export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

-  const dropCard = (
-    source: ElementDragPayload,
-    destination: DropTargetRecord
-  ) => {
-    const card = source.data.card as CardContent;
-    const columnId = destination.data.columnId as number;
-    const destinationCardId = destination.data.cardId as number;
-
-    // También aquí nos aseguramos de que estamos trabajando con el último estado
-    setKanbanContent((kanbanContent) =>
-      moveCard(card, { columnId, cardId: destinationCardId }, kanbanContent)
-    );
-  };
-
-  const dropColumn = (
-    source: ElementDragPayload,
-    destination: DropTargetRecord
-  ) => {
-    const columnOriginId = source.data.columnOriginId as number;
-    const columnDestinationId = destination.data.ColumnDestinationId as number;
-
-    // También aquí nos aseguramos de que estamos trabajando con el último estado
-    setKanbanContent((kanbanContent) =>
-      moveColumn(columnOriginId, columnDestinationId, kanbanContent)
-    );
-  };
-
-  const isDropCard = (source: ElementDragPayload) => {
-    return source.data.dragType === "CARD";
-  };
-
-  const isDropColumn = (source: ElementDragPayload) => {
-    return source.data.dragType === "COLUMN";
-  };
-
-  React.useEffect(() => {
-    return monitorForElements({
-      onDrop({ source, location }) {
-        const destination = location.current.dropTargets[0];
-        if (!destination) {
-          // si se suelta fuera de cualquier target
-          return;
-        }
-
-        if (isDropCard(source)) {
-          dropCard(source, destination);
-        }
-
-        if (isDropColumn(source)) {
-          dropColumn(source, destination);
-        }
-      },
-    });
-  }, [kanbanContent]);

+  useKanbanMonitor(kanbanContent, setKanbanContent);

  return (
    <div className={classes.container}>
```

Vamos a echarle un ojo al card:

Aquí podemos plantearnos:

- Hacer como con el monitor y tener el drag y drop en un hook.
- Podemos separarlo en dos hooks, uno para el drag y otro para el drop.

Siempre es complicado jugar a ser la _bruja local_ pero en principio parece que tiene lógica dividir el drag en un hook y el drop en otro ¿Por qué? Imaginate que a futuro creamos un elemento papelera en el que podemos mover las cartas, si tenemos el drop en un hook separado podemos reutilizarlo.

Vamos a por ello, analizamos que dependencias tendrías y se las pasamos por parámetro.

_./src/kanban/components/card/card-drag.hook.tsx_

```tsx
import React from "react";
import { useEffect, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import invariant from "tiny-invariant";

export const useCardDragHook = (
  ref: React.MutableRefObject<null>,
  content: CardContent
) => {
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ dragType: "CARD", card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return {
    dragging,
  };
};
```

> Si tuvieramos más de dos parámetros, nos plantearíamos o bien meter esa info en el hook, o crear una estrutura para pasarselos al hook.

Vamos a darle uso:

_./src/kanban/components/card/card.component.tsx_

```diff
import React from "react";
import { useEffect, useRef, useState } from "react";
import {
-  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
import invariant from "tiny-invariant";
import { GhostCard } from "../ghost-card.component/ghost-card.component";
+ import { useCardDragHook } from "./card-drag.hook";
```

```diff
export const Card: React.FC<Props> = (props) => {
  const { content, columnId } = props;
-  const [dragging, setDragging] = useState<boolean>(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef(null);

-  useEffect(() => {
-    const el = ref.current;
-
-    invariant(el);
-
-    return draggable({
-      element: el,
-      getInitialData: () => ({ dragType: "CARD", card: content }),
-      onDragStart: () => setDragging(true),
-      onDrop: () => setDragging(false),
-    });
-  }, []);
+ const { dragging } = useCardDragHook(ref, content);

  useEffect(() => {
    const el = ref.current;
```

Vemos que sigue funcionando.

Y ahora vamos a por el drop

_./src/kanban/components/card/card-drop.hook.tsx_

```tsx
import React from "react";
import { useEffect, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import invariant from "tiny-invariant";

interface DropInfo {
  columnId: number;
  content: CardContent;
}

export const useCardDropHook = (
  ref: React.MutableRefObject<null>,
  dropInfo: DropInfo
) => {
  const { content, columnId } = dropInfo;
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: content.id }),
      canDrop: ({ source }) => source.data.dragType === "CARD",
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  return { isDraggedOver };
};
```

Y como quedaría el componente:

_./src/kanban/components/card/card.component.tsx_

```diff
import React from "react";
- import { useEffect, useRef, useState } from "react";
+ import { useRef } from "react";
- import {
-  dropTargetForElements,
- } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
- import invariant from "tiny-invariant";
import { GhostCard } from "../ghost-card.component/ghost-card.component";
import { useCardDragHook } from "./card-drag.hook";
+ import { useCardDropHook } from "./card-drop.hook";
```

```diff
export const Card: React.FC<Props> = (props) => {
  const { content, columnId } = props;
-  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef(null);

  const { dragging } = useCardDragHook(ref, content);

-  useEffect(() => {
-    const el = ref.current;
-    invariant(el);
-
-    return dropTargetForElements({
-      element: el,
-      getData: () => ({ columnId, cardId: content.id }),
-      canDrop: ({ source }) => source.data.dragType === "CARD",
-      onDragEnter: () => setIsDraggedOver(true),
-      onDragLeave: () => setIsDraggedOver(false),
-      onDrop: () => setIsDraggedOver(false),
-    });
-  }, []);

+ const { isDraggedOver } = useCardDropHook(ref, { columnId, content });

  return (
    <div ref={ref}>
```
