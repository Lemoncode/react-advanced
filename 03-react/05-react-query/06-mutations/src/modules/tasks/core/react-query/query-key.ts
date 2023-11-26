export const queryKeys = {
  all: ["tasks"] as const,
  taskCollection: () => [...queryKeys.all, "taskCollection"] as const,
};
