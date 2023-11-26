import { MODULE_HOME_ROUTES } from "./home-routes.const";

import { DashboardScene } from "@home/scenes";

export const moduleHomeRoutes = [
  {
    path: MODULE_HOME_ROUTES.DASHBOARD,
    element: <DashboardScene />,
  },
];
