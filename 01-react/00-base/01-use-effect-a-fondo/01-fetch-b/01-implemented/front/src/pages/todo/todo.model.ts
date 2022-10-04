export interface TodoItem {
  id: number;
  description: string;
  isDone: boolean;
}

export const createEmptyTodoItem = (): TodoItem => ({
  id: 0,
  description: "",
  isDone: false,
});
