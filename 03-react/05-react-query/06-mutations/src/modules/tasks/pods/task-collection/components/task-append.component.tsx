import React from "react";
import { Mode, TaskVm, createEmptyTask } from "../task-collection.vm";
import { TaskItemEdit } from "./task-item-edit.component";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TaskVm) => void;
}

export const TaskAppendComponent: React.FC<Props> = (props: Props) => {
  const { mode, setAppendMode, onAppend, onCancel } = props;

  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <div>
          <TaskItemEdit
            item={createEmptyTask()}
            onSave={onAppend}
            onCancel={onCancel}
          />
        </div>
      )}
    </div>
  );
};
