import React from "react";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import { GithubCollectionPod } from "@/pods";

export const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
      <GithubCollectionPod />
      <Link to={generatePath(ROUTES.GITHUB_MEMBER, { id: "23" })}>
        Go to member
      </Link>
    </div>
  );
};
