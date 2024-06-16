import { produce } from "immer";
import { TaskVm } from "../task-collection.vm";
import { useMutation } from "@tanstack/react-query";
import { insertTask, updateTask } from "../task-collection.repository";
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

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },
    onMutate: async (newTask: TaskVm) => {
      // TODO Aquí hay que hacer más cosas, ver este ejemplo
      // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
      queryClient.setQueryData(queryKeys.taskCollection(), (old: TaskVm[]) => {
        return produce(old, (draft: TaskVm[]) => {
          const index = draft.findIndex((item) => item.id === newTask.id);
          if (index !== -1) {
            draft[index] = newTask;
          }
        });
      });
    },
  });

  return {
    insertTaskMutation,
    updateTaskMutation,
  };
};
