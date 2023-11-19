import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
    </div>
  );
};
