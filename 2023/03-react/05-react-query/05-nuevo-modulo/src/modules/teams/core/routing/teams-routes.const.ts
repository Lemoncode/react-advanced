const baseTeamsModuleRoutes = "/teams";

const genPath = (path: string) => `${baseTeamsModuleRoutes}${path}`;

export const MODULE_TEAMS_ROUTES = {
  GITHUB_MEMBER_COLLECTION: genPath("/github-members"),
  GITHUB_MEMBER: genPath("/github-member/:id"),
};
