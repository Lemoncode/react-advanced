import { MODULE_TEAMS_ROUTES } from "./teams-routes.const";

import {
  GithubMemberCollectionScene,
  GithubMemberScene,
} from "@/modules/teams/scenes";

export const moduleTeamsRoutes = [
  {
    path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION,
    element: <GithubMemberCollectionScene />,
  },
  { path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER, element: <GithubMemberScene /> },
];
