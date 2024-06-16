import React from "react";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
import { KanbanContext } from "./providers";

export const KanbanContainer: React.FC = () => {
  const { kanbanContent, setKanbanContent } = React.useContext(KanbanContext);

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
