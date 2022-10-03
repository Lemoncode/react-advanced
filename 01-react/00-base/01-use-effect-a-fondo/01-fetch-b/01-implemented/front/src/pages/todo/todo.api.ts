import { TodoItem } from "./todo.model";

export const getTodoList = async (): Promise<TodoItem[]> => {
  const response = await fetch(`http://localhost:3000/todos`);
  const data = await response.json();
  return data;
};
