import { useQuery, useMutation } from "@tanstack/react-query";
import { getTodoList, updateTodoItem, appendTodoItem } from "./todo.api";
import { todoKeys } from "./todo-key-queries";

export const useTodoListQuery = () => {
  return useQuery(todoKeys.todoList(), () => getTodoList());
};

export const useUpdateTodoItemMutation = (onSuccessFn: () => void) => {
  return useMutation(updateTodoItem, {
    onSuccess: () => onSuccessFn(),
  });
};

 export const useAppendTodoItemMutation = (onSuccessFn: () => void) => 
  useMutation(appendTodoItem, {onSuccess: () => onSuccessFn()});
