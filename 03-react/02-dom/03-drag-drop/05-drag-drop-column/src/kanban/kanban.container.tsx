import React from "react";
import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  CardContent,
  KanbanContent,
  createDefaultKanbanContent,
} from "./model";
import { loadKanbanContent } from "./api";
import { moveCard, moveColumn } from "./kanban.container.business";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
import { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

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

  const isDropCard = (source: ElementDragPayload) => {
    return source.data.dragType === "CARD";
  };

  const isDropColumn = (source: ElementDragPayload) => {
    return source.data.dragType === "COLUMN";
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

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          name={column.name}
          content={column.content}
          columnId={column.id}
        />
      ))}
    </div>
  );
};
