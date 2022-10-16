import React from "react";
import { defer, RouteObject } from "react-router-dom";
import { PageA } from "./a.page";
import { PageB } from "./b.page";
import { ModuleALayout } from "./module-a.layout";
import { getCharacter, getCharacterCollection } from "./character-collection.api";
import { DetailPage } from "./detail.page";

export const routesModuleA: RouteObject[] = [
  {
    path: "module-a",
    element: <ModuleALayout />,
    children: [
      {
        path: "page-a",
        loader: () =>
          defer({ characterCollection: getCharacterCollection("") }),
        element: <PageA />,
        children: [
          {
            path: ":id",
            loader: ({ params }) => getCharacter(params.id),
            element: <DetailPage />,
          },
        ],
      },
      {
        path: "page-b",
        element: <PageB />,
      },
    ],
  },
];
