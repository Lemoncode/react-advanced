import { moveCardColumn } from "../kanban.business";
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanState,
  MoveCardPayload,
} from "../model";

const handleSetKanbanContent = (
  _: KanbanState,
  newKanbanState: KanbanState
) => {
  return newKanbanState;
};

const handleMoveCard = (
  state: KanbanState,
  moveCardPayload: MoveCardPayload
): KanbanState => {
  const { columnDestinationId, dragItemInfo, dropCardId } = moveCardPayload;
  const { columnId: columnOriginId, content } = dragItemInfo;

  const columnDestination = state.columns.find(
    (column) => column.id === columnDestinationId
  );

  let cardIndex = columnDestination?.content.findIndex(
    (card) => card.id === dropCardId
  );

  cardIndex =
    cardIndex === -1
      ? columnDestination?.content.length ?? 0
      : cardIndex ?? 0 + 1;

  return moveCardColumn(
    {
      columnOriginId,
      columnDestinationId,
      cardIndex,
      content,
    },
    state
  );
};

export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanState(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
    default:
      return state;
  }
};
