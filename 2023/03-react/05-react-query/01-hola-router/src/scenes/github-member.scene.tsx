import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";

export const GithubMemberScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member</h1>
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>
        Back to member collection
      </Link>
    </div>
  );
};
