import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../home.page";
import { routesModuleA } from "../modules/module-a";
import { routesModuleB } from "../modules/module-b";

export const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  ...routesModuleA,
  ...routesModuleB,
]);
