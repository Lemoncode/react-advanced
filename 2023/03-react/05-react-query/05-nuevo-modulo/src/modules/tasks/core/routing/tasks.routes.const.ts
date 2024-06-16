// TODO: esto se podía hacer parametizable
// Así el módulo standalone podría ir con ruta raíz y el módulo integrado con ruta /tasks
const baseTasksModuleRoutes = "/tasks";

const genPath = (path: string) => `${baseTasksModuleRoutes}${path}`;

export const MODULE_TASKS_ROUTES = {
  TASK_COLLECTION: genPath("/task-collection"),
};
