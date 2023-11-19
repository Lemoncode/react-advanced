import React from "react";
import { RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleALayout } from "./module-a.layout";
import { getCharacterCollection } from "./character-collection.api";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
        loader: () => getCharacterCollection(""),
        element: <PageA />,
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
