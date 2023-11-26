import React from "react";
import { Link, generatePath } from "react-router-dom";
import { MODULE_TEAMS_ROUTES } from "@teams/core/routing";
import { GithubCollectionPod } from "@teams/pods";

export const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
      <GithubCollectionPod />
      <Link to={generatePath(MODULE_TEAMS_ROUTES.GITHUB_MEMBER, { id: "23" })}>
        Go to member
      </Link>
    </div>
  );
};
