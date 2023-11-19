import { moveCardColumn, deleteCard, moveColumn } from "../kanban.business";
import {
  KanbanState,
  KanbanAction,
  ActionTypes,
  createDefaultKanbanState,
  MoveCardPayload,
  DeleteCardPayload,
  MoveColumnPayload,
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

const handleDeleteCard = (
  state: KanbanState,
  payload: DeleteCardPayload
): KanbanState => deleteCard(payload.columnId, payload.cardId, state);

const handleMoveColumn = (
  state: KanbanState,
  payload: MoveColumnPayload
): KanbanState => ({
  ...state,
  columns: moveColumn(state.columns, payload),
});

export const kanbanReducer = (
  state: KanbanState = createDefaultKanbanState(),
  action: KanbanAction
): KanbanState => {
  switch (action.type) {
    case ActionTypes.SET_KANBAN_CONTENT:
      return handleSetKanbanContent(state, action.payload);
    case ActionTypes.MOVE_CARD:
      return handleMoveCard(state, action.payload);
    case ActionTypes.DELETE_CARD:
      return handleDeleteCard(state, action.payload);
    case ActionTypes.MOVE_COLUMN:
      return handleMoveColumn(state, action.payload);
    default:
      return state;
  }
};
