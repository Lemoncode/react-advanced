import { CardContent, Column, KanbanState } from "./model";
import { produce } from "immer";

interface MoveInfo {
  columnOriginId: number;
  columnDestinationId: number;
  cardIndex: number;
  content: CardContent;
}

// TODO this can be additionally refactored (apply clean code)
export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanState
): KanbanState => {
  const { columnOriginId, columnDestinationId, content, cardIndex } = moveInfo;
  let newKanbanContent = kanbanContent;

  const columnIndexOrigin = kanbanContent.columns.findIndex(
    (c) => c.id === columnOriginId
  );

  const columnIndexDestination = kanbanContent.columns.findIndex(
    (c) => c.id === columnDestinationId
  );

  if (columnIndexOrigin !== -1 && columnIndexDestination !== -1) {
    newKanbanContent = produce(kanbanContent, (draft) => {
      // remove
      draft.columns[columnIndexOrigin].content = kanbanContent.columns[
        columnIndexOrigin
      ].content.filter((c) => c.id !== content.id);
      // add
      draft.columns[columnIndexDestination].content.splice(
        cardIndex,
        0,
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
