import { CardContent, Column, KanbanState } from "./model";
import { produce } from "immer";

interface MoveInfo {
  columnOriginId: number;
  columnDestinationId: number;
  cardIndex: number;
  content: CardContent;
}

const findColumnIndexById = (columns: Column[], columnId: number) => {
  return columns.findIndex((c) => c.id === columnId);
};

const removeCardFromColumn = (
  columnContent: CardContent[],
  cardId: number
): CardContent[] => columnContent.filter((c) => c.id !== cardId);

const mutableInsertCardInColumn = (
  columnContent: CardContent[],
  cardIndex: number,
  content: CardContent
): void => {
  columnContent.splice(cardIndex, 0, content);
};

export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanState
): KanbanState => {
  const { columnOriginId, columnDestinationId, content, cardIndex } = moveInfo;
  let newKanbanContent = kanbanContent;

  const columnIndexOrigin = findColumnIndexById(
    kanbanContent.columns,
    columnOriginId
  );

  const columnIndexDestination = findColumnIndexById(
    kanbanContent.columns,
    columnDestinationId
  );

  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
      draft.columns[columnIndexOrigin].content = removeCardFromColumn(
        kanbanContent.columns[columnIndexOrigin].content,
        content.id
      );

      mutableInsertCardInColumn(
        draft.columns[columnIndexDestination].content,
        cardIndex,
        content
      );
    });
  }

  return newKanbanContent;
};

export const deleteCard = (
  columnId: number,
  cardId: number,
  kanbanContent: KanbanState
): KanbanState => {
  // Todo esto se usa también en el moveCard ¿Porque no crear un helper comun?
  const columnIndex = kanbanContent.columns.findIndex((c) => c.id === columnId);

  if (columnIndex !== -1) {
    return produce(kanbanContent, (draft) => {
      draft.columns[columnIndex].content = kanbanContent.columns[
        columnIndex
      ].content.filter((c) => c.id !== cardId);
    });
  }

  return kanbanContent;
};

export interface MoveColumnInfo {
  sourceColumnId: number;
  targetColumnId: number;
}

// TODO: habría que cubrir casos arista (id no encontrado etc...)
export const moveColumn = (
  columns: Column[],
  { sourceColumnId, targetColumnId }: MoveColumnInfo
): Column[] => {
  const sourceColumnIndex = columns.findIndex(
    (column) => column.id === sourceColumnId
  );
  const targetColumnIndex = columns.findIndex(
    (column) => column.id === targetColumnId
  );

  const sourceColumn = columns[sourceColumnIndex];
  const targetColumn = columns[targetColumnIndex];

  const newColumns = [...columns];
  newColumns[sourceColumnIndex] = targetColumn;
  newColumns[targetColumnIndex] = sourceColumn;
  return newColumns;
};
