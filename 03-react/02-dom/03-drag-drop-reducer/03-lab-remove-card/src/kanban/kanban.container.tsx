import React from "react";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
import { useKanbanContext } from "./providers";
import { ActionTypes } from "./model";

export const KanbanContainer: React.FC = () => {
  const { kanbanContent, dispatch } = useKanbanContext();

  React.useEffect(() => {
    loadKanbanContent().then((content) =>
      dispatch({ type: ActionTypes.SET_KANBAN_CONTENT, payload: content })
    );
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
