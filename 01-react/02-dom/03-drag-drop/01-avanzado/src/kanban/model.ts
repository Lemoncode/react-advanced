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

export interface KanbanContent {
  columns: Column[];
}

export const createDefaultKanbanContent = (): KanbanContent => ({
  columns: [],
});

export interface DragItemInfo {
  columnId: number;
  content: CardContent;
}

export const createDragItemInfo = (columnId: number, content: CardContent): DragItemInfo => ({
  columnId,
  content: content,
});
