import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent } from "./components";

export const TaskCollectionPod: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);

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
        onAppend={(item) => {
          console.log("TODO... save", item);
        }}
      />
    </div>
  );
};
