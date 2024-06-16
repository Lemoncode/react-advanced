// TODO: esto submodulo podría ir en el router raíz
// así podríamos tanto tener rutas de raíz si ejeutamos esto como stand alone
// o on prefijos en el módulo que toque
const baseTasksModuleRoutes = "/tasks";

const genPath = (path: string) => `${baseTasksModuleRoutes}${path}`;

export const MODULE_TASKS_ROUTES = {
  TASK_COLLECTION: genPath("/task-collection"),
};
