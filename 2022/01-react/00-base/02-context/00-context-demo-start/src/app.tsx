import React from "react";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";

export const App = () => {
  return (
    <ProfileProvider>
      <RouterComponent />
    </ProfileProvider>
  );
};
