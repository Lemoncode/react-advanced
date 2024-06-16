import { queryKeys } from "@tasks/core/react-query";
import { getTaskCollection } from "./task-collection.repository";
import { useQuery } from "@tanstack/react-query";
import { TaskVm } from "./task-collection.vm";

export const useTaskCollectionQuery = (enabled: boolean) => {
  const { data: taskCollection = [], isError } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
    refetchOnWindowFocus: true,
    enabled,
    retry: false,
  });

  return {
    taskCollection,
    isError,
  };
};
