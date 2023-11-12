import React from "react";
import { createDefaultKanbanState } from "../model";
import { KanbanContext } from "./kanban.context";
import { kanbanReducer } from "./kanban.reducer";

interface Props {
  children: React.ReactNode;
}

export const KanbanProvider: React.FC<Props> = ({ children }) => {
  const [kanbanContent, dispatch] = React.useReducer(
    kanbanReducer,
    createDefaultKanbanState()
  );

  return (
    <KanbanContext.Provider
      value={{
        kanbanContent,
        dispatch,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
