import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
import { loadKanbanContent } from "./api";
import { Column } from "./components";
import classes from "./kanban.container.module.css";
import { useKanbanMonitor } from "./kanban-monitor.hook";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  useKanbanMonitor(kanbanContent, setKanbanContent);

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
