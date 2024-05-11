export type Mode = "Readonly" | "Append" | "Edit";

export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}

export const createEmptyTask = (): TaskVm => ({
  id: 0,
  description: "",
  isDone: false,
});
