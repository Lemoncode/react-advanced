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
    dropCardId: number,
    dragItemInfo: DragItemInfo
  ) => {
    const { columnId: columnOriginId, content } = dragItemInfo;

    // TODO: este código se puede refactorizar
    const columnDestination = kanbanContent.columns.find(
      (column) => column.id === columnDestinationId
    );

    let cardIndex = columnDestination?.content.findIndex(
      (card) => card.id === dropCardId
    );

    cardIndex =
      cardIndex === -1 ? columnDestination.content.length : cardIndex + 1;

    setKanbanContent((kanbanContentLatest) =>
      moveCardColumn(
        {
          columnOriginId,
          columnDestinationId,
          cardIndex,
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
