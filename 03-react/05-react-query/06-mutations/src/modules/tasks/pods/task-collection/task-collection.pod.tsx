import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import classes from "./task-collection.pod.module.css";

export const TaskCollectionPod: React.FC = () => {
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
      <div className={classes.todolist}>
        {taskCollection.map((task) => (
          <React.Fragment key={task.id}>
            <div>{task.isDone ? "✅" : "⭕️"}</div>
            <div>{task.description}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
