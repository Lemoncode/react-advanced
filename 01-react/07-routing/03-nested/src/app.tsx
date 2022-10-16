import React from "react";
import ReactDOM from "react-dom/client";
import { appRoutes } from "./core/routes";
import { RouterProvider, useNavigation } from "react-router-dom";

export const App = () => {
  return (
    <>
      <RouterProvider router={appRoutes} />
    </>
  );
};
