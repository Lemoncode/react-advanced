import { CardContent, KanbanContent } from "./model";
import produce from "immer";

interface MoveInfo {
  columnOriginId: number;
  columnDestinationId: number;
  content: CardContent;
}

// TODO this can be additionally refactored (apply clean code)
export const moveCardColumn = (
  moveInfo: MoveInfo,
  kanbanContent: KanbanContent
): KanbanContent => {
  const { columnOriginId, columnDestinationId, content } = moveInfo;
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
      draft.columns[columnIndexDestination].content.push(content);
    });
  }

  return newKanbanContent;
};
