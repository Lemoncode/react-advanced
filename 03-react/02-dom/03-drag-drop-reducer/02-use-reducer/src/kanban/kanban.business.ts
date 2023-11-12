import { CardContent, KanbanState } from "./model";
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
