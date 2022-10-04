export const coreKeys = {
  all: ["todo"] as const,
  todoList: () => [...coreKeys.all, "todoList"] as const,
};
