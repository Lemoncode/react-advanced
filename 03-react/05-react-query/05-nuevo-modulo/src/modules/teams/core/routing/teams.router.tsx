import { MODULE_TEAMS_ROUTES } from "./teams-routes.const";

// TODO: esto va a fallar porque no tenemos las escenas migradas
import { GithubMemberCollectionScene, GithubMemberScene } from "@teams/scenes";

export const moduleTeamsRoutes = [
  {
    path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION,
    element: <GithubMemberCollectionScene />,
  },
  { path: MODULE_TEAMS_ROUTES.GITHUB_MEMBER, element: <GithubMemberScene /> },
];
