import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { moduleHomeRoutes } from "@home/core/routing";
import { moduleTeamsRoutes } from "@teams/core/routing";

export const MainAppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {moduleHomeRoutes.map((route: any) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Routes>
        {moduleTeamsRoutes.map((route: any) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
