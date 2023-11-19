import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import { GithubCollectionPod } from "@/pods";
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
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Go to member collection</Link>
    </div>
  );
};
