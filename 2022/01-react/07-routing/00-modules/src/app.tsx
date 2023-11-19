import React from "react";
import ReactDOM from "react-dom/client";
import { appRoutes } from "./core/routes";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  return <RouterProvider router={appRoutes} />;
};
