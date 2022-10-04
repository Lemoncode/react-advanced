import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
import { TodoItem } from "./todo.model";
import { coreKeys } from "./todo-key-queries";

export const useTodoListQuery = () => {
  return useQuery(coreKeys.todoList(), () =>
    getTodoList()
  );
};