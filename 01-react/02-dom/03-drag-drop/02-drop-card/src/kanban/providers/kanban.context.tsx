import React from "react";
import {
  createDefaultKanbanContent,
  DragItemInfo,
  KanbanContent,
} from "../model";

export interface KanbanContextModel {
  kanbanContent: KanbanContent;
  setKanbanContent: (kanbanContent: KanbanContent) => void;
  moveCard: (
    columnDestinationId: number,
    dropCardId: number,
    dragItemInfo: DragItemInfo
  ) => void;
}

export const KanbanContext = React.createContext<KanbanContextModel>({
  kanbanContent: createDefaultKanbanContent(),
  setKanbanContent: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
  moveCard: () => null,
});
