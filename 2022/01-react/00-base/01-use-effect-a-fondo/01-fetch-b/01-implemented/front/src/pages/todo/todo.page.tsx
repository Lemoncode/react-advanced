import React from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "./todo-key-queries";
import {
  useTodoListQuery,
  useUpdateTodoItemMutation,
  useAppendTodoItemMutation,
} from "./todo-query";
import classes from "./todo.page.css";
import { TodoItem, ReadOnlyMode, AppendMode } from "./todo.model";
import { TodoItemComponent, TodoAppendComponent } from "./components";

const useTodoQueries = () => {
  const handleSaveSuccess = () => {
    queryClient.invalidateQueries(todoKeys.todoList());
  };

  const queryClient = useQueryClient();
  const { data } = useTodoListQuery();
  const updateMutation = useUpdateTodoItemMutation(handleSaveSuccess);
  const appendMutation = useAppendTodoItemMutation(handleSaveSuccess);

  return {
    data,
    updateMutation,
    appendMutation,
    handleSaveSuccess,
  };
};

export const TodoPage: React.FC = () => {
  const { data, updateMutation, appendMutation, handleSaveSuccess } =
    useTodoQueries();
  const [editingId, setEditingId] = React.useState(ReadOnlyMode);

  const handleEnterEditMode = (id: number) => {
    setEditingId(id);
  };

  const handleUpdate = (item: TodoItem) => {
    updateMutation.mutate(item);
    setEditingId(ReadOnlyMode);
  };

  const handleAppend = (item: TodoItem) => {
    appendMutation.mutate(item);
    setEditingId(ReadOnlyMode);
  };

  const handleCancel = () => {
    setEditingId(ReadOnlyMode);
  };

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
          <TodoItemComponent
            key={todo.id}
            todo={todo}
            editingId={editingId}
            onEnterEditMode={handleEnterEditMode}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
          />
        ))}
      </div>
      <div className={classes.appendContainer}>
        <TodoAppendComponent
          editingId={editingId}
          setAppendMode={() => setEditingId(AppendMode)}
          onAppend={handleAppend}
          onCancel={() => setEditingId(ReadOnlyMode)}
        />
      </div>
      <Link to="/list">To List</Link>
    </>
  );
};
