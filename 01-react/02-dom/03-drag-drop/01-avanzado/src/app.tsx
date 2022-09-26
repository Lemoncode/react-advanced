import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { KanbanContainer, KanbanProvider } from "./kanban";

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanProvider>
        <KanbanContainer />
      </KanbanProvider>
    </DndProvider>
  );
};
