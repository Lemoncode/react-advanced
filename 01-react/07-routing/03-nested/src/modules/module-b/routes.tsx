import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleBLayout } from "./module-b.layout";

export const routesModuleB: RouteObject[] = [
  {
    path: "module-b",
    element: <ModuleBLayout />,
    children: [
      {
        path: "page-a",
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
