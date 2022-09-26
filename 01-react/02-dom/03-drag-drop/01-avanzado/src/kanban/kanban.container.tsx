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

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column
          key={column.id}
          name={column.name}
          content={column.content}
          onAddCard={handleAddCard(column.id)}
        />
      ))}
    </div>
  );
};
