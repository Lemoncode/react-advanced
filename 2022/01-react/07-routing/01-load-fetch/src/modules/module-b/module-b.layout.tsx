import React from "react";
import { Outlet } from "react-router-dom";

export const ModuleBLayout = () => {
  return (
    <div>
      <h1>Module B</h1>
      <Outlet />
    </div>
  );
};
