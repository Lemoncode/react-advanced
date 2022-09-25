import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
} from "./model";
import { loadKanbanContent } from "./kanban.api";
import { Column } from "./column.component";
import classes from "./kanban.container.css";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column key={column.id} name={column.name} content={column.content} />
      ))}
    </div>
  );
};
