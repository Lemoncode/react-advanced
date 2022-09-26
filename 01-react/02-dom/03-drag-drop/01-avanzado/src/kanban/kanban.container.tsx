import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
  DragItemInfo,
} from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
import produce from "immer";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  const handleMoveCard =
    (columnDestinationId: number) => (dragItemInfo: DragItemInfo) => {
      const { columnId: columnOriginId, content } = dragItemInfo;

      const columnIndexOrigin = kanbanContent.columns.findIndex(
        (c) => c.id === columnOriginId
      );

      const columnIndexDestination = kanbanContent.columns.findIndex(
        (c) => c.id === columnDestinationId
      );

      if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
        setKanbanContent((kanbanContentLatest) =>
          produce(kanbanContentLatest, (draft) => {
            // remove
            draft.columns[columnIndexOrigin].content =
              kanbanContentLatest.columns[columnIndexOrigin].content.filter(
                (c) => c.id !== content.id
              );
            // add
            draft.columns[columnIndexDestination].content.push(content);
          })
        );
      }
    };

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          columnId={column.id}
          name={column.name}
          content={column.content}
          onMoveCard={handleMoveCard(column.id)}
        />
      ))}
    </div>
  );
};
