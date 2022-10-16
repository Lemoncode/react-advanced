import React from "react";
import { Outlet } from "react-router-dom";

export const ModuleALayout = () => {
  return (
    <div>
      <h1>Module A</h1>
      <Outlet />
    </div>
  );
};
