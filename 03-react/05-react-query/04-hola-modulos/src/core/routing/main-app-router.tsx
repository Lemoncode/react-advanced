import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { moduleHomeRoutes } from "@home/core/routing";
import { moduleTeamsRoutes, ModuleTeamRootProviders } from "@teams/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const MainAppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ModuleTeamRootProviders>
              <Outlet />
              <ReactQueryDevtools />
            </ModuleTeamRootProviders>
          }
        >
          {/* Ojo a la ñapa aquí */}
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
