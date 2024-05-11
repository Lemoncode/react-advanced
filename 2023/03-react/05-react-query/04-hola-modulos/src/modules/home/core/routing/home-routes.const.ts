const baseHomeModuleRoutes = "";

const genPath = (path: string) => `${baseHomeModuleRoutes}${path}`;

export const MODULE_HOME_ROUTES = {
  DASHBOARD: genPath("/"),
};
