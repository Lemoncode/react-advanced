import React from "react";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.css";
import { ActionTypes } from "./model";
import { KanbanContext } from "./providers/kanban.context";

export const KanbanContainer: React.FC = () => {
  const { kanbanContent, dispatch } = React.useContext(KanbanContext);

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
