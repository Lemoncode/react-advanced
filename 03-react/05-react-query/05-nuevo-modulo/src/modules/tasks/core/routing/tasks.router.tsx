import { MODULE_TASKS_ROUTES } from "./tasks.routes.const";

import { TaskCollectionScene } from "@tasks/scenes";

export const moduleTasksRoutes = [
  {
    path: MODULE_TASKS_ROUTES.TASK_COLLECTION,
    element: <TaskCollectionScene />,
  },
];
