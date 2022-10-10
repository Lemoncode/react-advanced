import React from "react";
import { FullnameProvider } from "./core";
import { DisplayNameComponent, EditNameComponent } from "./components";

export const App = () => {
  return (
    <FullnameProvider>
      <DisplayNameComponent />
      <EditNameComponent />
    </FullnameProvider>
  );
};
