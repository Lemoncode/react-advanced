import { TodoItem } from "./todo.model";

export const getTodoList = async (): Promise<TodoItem[]> => {
  const response = await fetch(`http://localhost:3000/todos`);
  const data = await response.json();
  return data;
};

export const updateTodoItem = async (item: TodoItem): Promise<TodoItem> => {
  const response = await fetch(`http://localhost:3000/todos/${item.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await response.json();
  return data;
};

export const appendTodoItem = async (item: TodoItem): Promise<TodoItem> => {
  const response = await fetch(`http://localhost:3000/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await response.json();
  return data;
}
