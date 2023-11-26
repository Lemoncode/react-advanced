import React from "react";
import { Mode, TaskVm } from "../task-collection.vm";
import { TaskDisplayRowComponent, TaskEditRowComponent } from "./rows";

interface Props {
  editingId: number;
  mode: Mode;
  todo: TaskVm;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TaskVm) => void;
  onCancel: () => void;
}

export const TaskRowComponent: React.FC<Props> = (props: Props) => {
  const { todo, editingId, mode, onEnterEditMode, onUpdate, onCancel } = props;

  return (
    <>
      {mode === "Readonly" || todo.id !== editingId ? (
        <TaskDisplayRowComponent
          key={todo.id}
          item={todo}
          onEdit={onEnterEditMode}
        />
      ) : (
        <TaskEditRowComponent
          key={todo.id}
          item={todo}
          onSave={onUpdate}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
