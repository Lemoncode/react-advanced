import React from "react";
import { DragItemInfo } from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
import { KanbanContext } from "./providers/kanban.context";

export const KanbanContainer: React.FC = () => {
  const { kanbanContent, setKanbanContent, moveCard } =
    React.useContext(KanbanContext);

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
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
