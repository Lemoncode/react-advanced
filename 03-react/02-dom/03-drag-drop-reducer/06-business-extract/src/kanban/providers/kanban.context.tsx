import React from "react";
import { KanbanState, KanbanAction } from "../model";

export interface KanbanContextProps {
  kanbanContent: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
}

export const KanbanContext = React.createContext<KanbanContextProps | null>(
  null
);

export const useKanbanContext = (): KanbanContextProps => {
  const context = React.useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanbanContext must be used within a KanbanProvider");
  }

  return context;
};
