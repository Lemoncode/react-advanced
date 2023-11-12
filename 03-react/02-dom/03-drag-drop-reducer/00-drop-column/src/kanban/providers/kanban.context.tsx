import React from "react";
import {
  createDefaultKanbanContent,
  DragItemInfo,
  KanbanContent,
} from "../model";

export interface KanbanContextProps {
  kanbanContent: KanbanContent;
  setKanbanContent: (kanbanContent: KanbanContent) => void;
  moveCard: (
    columnDestinationId: number,
    index: number,
    dragItemInfo: DragItemInfo
  ) => void;
}

export const KanbanContext = React.createContext<KanbanContextProps>({
  kanbanContent: createDefaultKanbanContent(),
  setKanbanContent: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
  moveCard: () => null,
});

export const useKanbanContext = (): KanbanContextProps => {
  const context = React.useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanbanContext must be used within a KanbanProvider");
  }

  return context;
};
