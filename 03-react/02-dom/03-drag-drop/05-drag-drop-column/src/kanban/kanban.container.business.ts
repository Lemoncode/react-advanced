import { CardContent, Column, KanbanContent } from "./model";
import { produce } from "immer";

type DropArgs = { columnId: number; cardId: number };

// Esto se podría hacer más optimo

const removeCardFromColumn = (
  card: CardContent,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newColumns = kanbanContent.columns.map((column) => {
    const newContent = column.content.filter((c) => c.id !== card.id);

    return {
      ...column,
      content: newContent,
    };
  });

  return {
    ...kanbanContent,
    columns: newColumns,
  };
};

const dropCardAfter = (
  origincard: CardContent,
  destinationCardId: number,
  destinationColumn: Column
): Column => {
  if (destinationCardId === -1) {
    return produce(destinationColumn, (draft) => {
      draft.content.push(origincard);
    });
  }

  return produce(destinationColumn, (draft) => {
    const index = draft.content.findIndex(
      (card) => card.id === destinationCardId
    );
    draft.content.splice(index, 0, origincard);
  });
};

const addCardToColumn = (
  card: CardContent,
  dropArgs: DropArgs,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newColumns = kanbanContent.columns.map((column) => {
    if (column.id === dropArgs.columnId) {
      return dropCardAfter(card, dropArgs.cardId, column);
    }
    return column;
  });

  return {
    ...kanbanContent,
    columns: newColumns,
  };
};

export const moveCard = (
  card: CardContent,
  dropArgs: DropArgs,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newKanbanContent = removeCardFromColumn(card, kanbanContent);
  return addCardToColumn(card, dropArgs, newKanbanContent);
};

export const moveColumn = (
  columnOriginId: number,
  columnDestinationId: number,
  kanbanContent: KanbanContent
): KanbanContent => {
  return produce(kanbanContent, (draft) => {
    const originIndex = draft.columns.findIndex(
      (column) => column.id === columnOriginId
    );
    const destinationIndex = draft.columns.findIndex(
      (column) => column.id === columnDestinationId
    );

    const [removed] = draft.columns.splice(originIndex, 1);
    draft.columns.splice(destinationIndex, 0, removed);
  });
};

