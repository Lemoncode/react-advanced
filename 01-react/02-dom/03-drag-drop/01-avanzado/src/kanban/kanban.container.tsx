import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
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

  const handleAddCard = (columnId: number) => (card: CardContent) => {
    setKanbanContent(
      produce(kanbanContent, (draft) => {
        const column = draft.columns.find((c) => c.id === columnId);
        if (column) {
          column.content.push(card);
        }
      })
    );
  };

  const handleRemoveCard = (columnId: number) => (card: CardContent) => {
    const columnIndex = kanbanContent.columns.findIndex(
      (c) => c.id === columnId
    );

    if (columnIndex !== -1) {
      setKanbanContent((kanbanContentLatest) =>
        produce(kanbanContentLatest, (draft) => {
          draft.columns[columnIndex].content = kanbanContentLatest.columns[
            columnIndex
          ].content.filter((c) => c.id !== card.id);
        })
      );
    }
  };

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          name={column.name}
          content={column.content}
          onAddCard={handleAddCard(column.id)}
          onRemoveCard={handleRemoveCard(column.id)}
        />
      ))}
    </div>
  );
};
