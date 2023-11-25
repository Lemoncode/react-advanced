import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { moduleHomeRoutes } from "@home/core/routing";
import { moduleTeamsRoutes, ModuleTeamRootProviders } from "@teams/index";

export const MainAppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ModuleTeamRootProviders>
              <Outlet />
            </ModuleTeamRootProviders>
          }
        >
          {moduleHomeRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {moduleTeamsRoutes.map((route: any) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
