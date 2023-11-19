export const ItemTypes = {
  CARD: "card",
  COLUMN: "column",
};

export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  id: number;
  name: string;
  content: CardContent[];
}

export interface KanbanState {
  columns: Column[];
}

export const createDefaultKanbanState = (): KanbanState => ({
  columns: [],
});

export enum ActionTypes {
  SET_KANBAN_CONTENT = "SET_KANBAN_CONTENT",
  MOVE_CARD = "MOVE_CARD",
  DELETE_CARD = "DELETE_CARD",
  MOVE_COLUMN = "MOVE_COLUMN",
}

export interface MoveCardPayload {
  columnDestinationId: number;
  dropCardId: number;
  dragItemInfo: DragItemInfo;
}

export interface DeleteCardPayload {
  columnId: number;
  cardId: number;
}

export interface MoveColumnPayload {
  sourceColumnId: number;
  targetColumnId: number;
}

export type KanbanAction =
  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
  | {
      type: ActionTypes.MOVE_CARD;
      payload: MoveCardPayload;
    }
  | { type: ActionTypes.DELETE_CARD; payload: DeleteCardPayload }
  | { type: ActionTypes.MOVE_COLUMN; payload: MoveColumnPayload };

export interface DragItemInfo {
  columnId: number;
  content: CardContent;
}

export const createDragItemInfo = (
  columnId: number,
  content: CardContent
): DragItemInfo => ({
  columnId,
  content,
});
