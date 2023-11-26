import { useMutation } from "@tanstack/react-query";
import { insertTask } from "../task-collection.repository";
import { queryClient, queryKeys } from "@tasks/core/react-query";

export const useTaskMutation = () => {
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },
  });

  return {
    insertTaskMutation,
  };
};
