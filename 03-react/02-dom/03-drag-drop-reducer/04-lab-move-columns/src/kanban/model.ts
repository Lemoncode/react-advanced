export const ItemTypes = {
  CARD: "card",
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

export type KanbanAction =
  | { type: ActionTypes.SET_KANBAN_CONTENT; payload: KanbanState }
  | {
      type: ActionTypes.MOVE_CARD;
      payload: MoveCardPayload;
    }
  | { type: ActionTypes.DELETE_CARD; payload: DeleteCardPayload };

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
