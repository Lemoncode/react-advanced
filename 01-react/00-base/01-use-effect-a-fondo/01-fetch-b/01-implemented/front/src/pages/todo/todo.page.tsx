import React from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "./todo-key-queries";
import { useTodoListQuery, useUpdateTodoItemMutation } from "./todo-query";
import classes from "./todo.page.css";
import { TodoItem } from "./todo.model";
import { TodoItemDisplay, TodoItemEdit } from "./components";

const ReadOnlyMode = -1;
const AppendMode = 0;

export const TodoPage: React.FC = () => {
  const queryClient = useQueryClient();

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries(todoKeys.todoList());
  };

  const { data } = useTodoListQuery();
  const mutation = useUpdateTodoItemMutation(handleUpdateSuccess);
  const [editingId, setEditingId] = React.useState(ReadOnlyMode);

  const handleEnterEditMode = (id: number) => {
    setEditingId(id);
  };

  const handleSave = (item: TodoItem) => {
    mutation.mutate(item);
    setEditingId(ReadOnlyMode);
  };

  const handleCancel = () => {
    setEditingId(ReadOnlyMode);
  };

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) =>
          todo.id !== editingId ? (
            <TodoItemDisplay
              key={todo.id}
              item={todo}
              onEdit={handleEnterEditMode}
            />
          ) : (
            <TodoItemEdit
              key={todo.id}
              item={todo}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )
        )}
      </div>
      <Link to="/list">To List</Link>
    </>
  );
};
