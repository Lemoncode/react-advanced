import React from "react";
import { TaskVm } from "./task-collection.vm";
import { TaskAppendComponent } from "./components";
import { usePodQuery } from "./task-collection.hook";
import classes from "./task-collection.pod.module.css";
import { TaskRowComponent } from "./components/task-row.component";

export const TaskCollectionPod: React.FC = () => {
  const {
    mode,
    setMode,
    editingId,
    setEditingId,
    taskCollection,
    insertTaskMutation,
    updateTaskMutation,
    isError,
    setConnectionLost,
  } = usePodQuery();

  const setReadOnlyMode = () => {
    setMode("Readonly");
    setEditingId(-1);
  };

  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setReadOnlyMode();
  };

  const handleUpdate = (item: TaskVm) => {
    updateTaskMutation(item);
    setMode("Readonly");
    setReadOnlyMode();
  };

  const handleCancel = () => {
    setMode("Readonly");
    setEditingId(-1);
  };

  const handleEnterEditMode = (id: number) => {
    console.log("** Enter Edit mode");
    setMode("Edit");
    // TODO... más cosas por venir
    setEditingId(id);
  };

  if (isError) {
    return <button onClick={() => setConnectionLost(false)}>Reconectar</button>;
  }

  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todolist}>
        {taskCollection.map((task) => (
          <TaskRowComponent
            key={task.id}
            editingId={editingId}
            mode={mode}
            todo={task}
            onEnterEditMode={handleEnterEditMode}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
          />
        ))}
        <TaskAppendComponent
          mode={mode}
          setAppendMode={() => setMode("Append")}
          onCancel={() => setMode("Readonly")}
          onAppend={handleAppend}
        />
      </div>
    </div>
  );
};
