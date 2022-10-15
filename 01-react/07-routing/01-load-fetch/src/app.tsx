import React from "react";
import ReactDOM from "react-dom/client";
import { appRoutes } from "./core/routes";
import { RouterProvider, useNavigation } from "react-router-dom";

export const App = () => {
  return (
    <>
      <h2>Hola</h2>
      <RouterProvider router={appRoutes} />
      <h2>Ke aze !</h2>
    </>
  );
};
