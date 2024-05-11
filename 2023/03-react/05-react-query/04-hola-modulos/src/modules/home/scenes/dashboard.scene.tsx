import React from "react";
import { Link } from "react-router-dom";
import { MODULE_TEAMS_ROUTES } from "@teams/core/routing";
import { GithubCollectionPod } from "@teams/pods";
import classes from "./dashboard.scene.module.css";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className={classes.container}>
        <GithubCollectionPod />
        <div>
          <h1>Place holder for tasks</h1>
        </div>
      </div>
      <Link to={MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION}>
        Go to member collection
      </Link>
    </div>
  );
};
