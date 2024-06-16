import React from "react";
import { RouterComponent } from "@/core/router";
import { ThemeProviderComponent } from "@/core/theme";
import { CenteredLayout } from "@/layouts";
import "./app.global-styles";

export const App: React.FC = () => {
  return (
    <ThemeProviderComponent>
      <CenteredLayout>
        <RouterComponent />
      </CenteredLayout>
    </ThemeProviderComponent>
  );
};
