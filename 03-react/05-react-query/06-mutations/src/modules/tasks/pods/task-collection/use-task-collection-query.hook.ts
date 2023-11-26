import { queryKeys } from "@tasks/core/react-query";
import { getTaskCollection } from "./task-collection.repository";
import { useQuery } from "@tanstack/react-query";
import { TaskVm } from "./task-collection.vm";

export const useTaskCollectionQuery = () => {
  const { data: taskCollection = [] } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  });

  return {
    taskCollection,
  };
};
