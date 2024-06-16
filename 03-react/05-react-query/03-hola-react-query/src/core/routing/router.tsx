import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";
import {
  DashboardScene,
  GithubMemberScene,
  GithubMemberCollectionScene,
} from "@/scenes";

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<DashboardScene />} />
        <Route
          path={ROUTES.GITHUB_MEMBER_COLLECTION}
          element={<GithubMemberCollectionScene />}
        />
        <Route path={ROUTES.GITHUB_MEMBER} element={<GithubMemberScene />} />
      </Routes>
    </HashRouter>
  );
};
