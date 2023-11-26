import React from "react";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent } from "./components";
import { useTaskCollectionQuery, useTaskMutation } from "./queries";
import { TaskVm } from "./task-collection.vm";

export const TaskCollectionPod: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
  const { insertTaskMutation } = useTaskMutation();

  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setMode("Readonly");
  };

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  if (isError) {
    return <button onClick={() => setConnectionLost(false)}>Reconectar</button>;
  }

  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todoList}>
        {taskCollection.map((task) => (
          <React.Fragment key={task.id}>
            <div>{task.isDone ? "✅" : "⭕️"}</div>
            <div>{task.description}</div>
          </React.Fragment>
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
