import React from "react";
import { moveCardColumn } from "../kanban.business";
import {
  KanbanContent,
  createDefaultKanbanContent,
  DragItemInfo,
} from "../model";
import { KanbanContext } from "./kanban.context";

interface Props {
  children: React.ReactNode;
}

export const KanbanProvider: React.FC<Props> = ({ children }) => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  const moveCard = (
    columnDestinationId: number,
    dragItemInfo: DragItemInfo
  ) => {
    const { columnId: columnOriginId, content } = dragItemInfo;

    setKanbanContent((kanbanContentLatest) =>
      moveCardColumn(
        {
          columnOriginId,
          columnDestinationId,
          content,
        },
        kanbanContentLatest
      )
    );
  };

  return (
    <KanbanContext.Provider
      value={{
        kanbanContent,
        setKanbanContent,
        moveCard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
