import { MODULE_HOME_ROUTES } from "./home-routes.const";

// TODO: Va a petar por ahora porque no hemos migrado las scenes todavía
import { DashboardScene } from "@home/scenes";

export const moduleHomeRoutes = [
  {
    path: MODULE_HOME_ROUTES.DASHBOARD,
    element: <DashboardScene />,
  },
];
