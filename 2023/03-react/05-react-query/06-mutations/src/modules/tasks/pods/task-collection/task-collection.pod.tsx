import React from "react";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent, TaskRowComponent } from "./components";
import { useTaskCollectionQuery, useTaskMutation } from "./queries";
import { TaskVm } from "./task-collection.vm";

const usePodQuery = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
  const { insertTaskMutation, updateTaskMutation } = useTaskMutation();

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  return {
    mode,
    setMode,
    editingId,
    setEditingId,
    connectionLost,
    setConnectionLost,
    taskCollection,
    insertTaskMutation,
    updateTaskMutation,
    isError,
  };
};

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

  // TODO: esto lo podemos mover al hook usePodQuery
  const setReadonlyMode = () => {
    setMode("Readonly");
    setEditingId(-1);
  };

  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setReadonlyMode();
  };

  const handleUpdate = (item: TaskVm) => {
    updateTaskMutation(item);
    setReadonlyMode();
  };

  const handleCancel = () => {
    setReadonlyMode();
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
      <div className={classes.todoList}>
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
      </div>
      <TaskAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
        onAppend={handleAppend}
      />
    </div>
  );
};
