import React from "react";
import { Link } from "react-router-dom";
import { MODULE_TEAMS_ROUTES } from "@teams/index";
import { MODULE_TASKS_ROUTES } from "@tasks/core/routing";
import { GithubCollectionPod } from "@teams/index";
import classes from "./dashboard.scene.module.css";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className={classes.container}>
        <GithubCollectionPod />
        <div>
          <Link to={MODULE_TASKS_ROUTES.TASK_COLLECTION}>
            Navigate to tasks module
          </Link>
        </div>
      </div>
      <Link to={MODULE_TEAMS_ROUTES.GITHUB_MEMBER_COLLECTION}>
        Go to member collection
      </Link>
    </div>
  );
};
