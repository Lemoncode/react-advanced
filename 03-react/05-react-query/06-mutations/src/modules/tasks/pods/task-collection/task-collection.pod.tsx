import { useTaskCollectionQuery } from "./use-task-collection-query.hook";

export const TaskCollectionPod: React.FC = () => {
  const { taskCollection } = useTaskCollectionQuery();

  return (
    <div>
      <h1>Task Collection POD</h1>
      {taskCollection.map((task) => (
        <div key={task.id}>
          <span>{task.description}</span>
        </div>
      ))}
    </div>
  );
};
