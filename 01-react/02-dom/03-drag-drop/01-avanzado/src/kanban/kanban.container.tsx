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
import { moveCardColumn } from "./kanban.business";

const useKanbanState = (): [
  KanbanContent,
  React.Dispatch<React.SetStateAction<KanbanContent>>
] => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  return [kanbanContent, setKanbanContent];
};

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = useKanbanState();

  const handleMoveCard =
    (columnDestinationId: number) => (dragItemInfo: DragItemInfo) => {
      const { columnId: columnOriginId, content } = dragItemInfo;

      setKanbanContent((kanbanContentLatest) =>
        moveCardColumn(
          {
            columnOriginId,
            columnDestinationId,
            content,
          },
          kanbanContentLatest
        )
      );
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
