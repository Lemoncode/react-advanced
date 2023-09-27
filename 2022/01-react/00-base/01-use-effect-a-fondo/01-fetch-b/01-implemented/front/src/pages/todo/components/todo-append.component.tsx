import React from "react";
import { TodoItem, AppendMode, ReadOnlyMode } from "../todo.model";
import { TodoItemEdit } from "./todo-item-edit.component";
import classes from "./todo-append.component.css";

interface Props {
  editingId: number;
  setAppendMode: () => void;
  onAppend: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoAppendComponent: React.FC<Props> = (props: Props) => {
  const { editingId, setAppendMode, onAppend, onCancel } = props;

  return (
    <>
      {editingId !== AppendMode ? (
        <button onClick={setAppendMode}>Enter Insert New Item Node</button>
      ) : (
        <div className={classes.todoList}>
          <TodoItemEdit onSave={onAppend} onCancel={onCancel} />
        </div>
      )}
    </>
  );
};
