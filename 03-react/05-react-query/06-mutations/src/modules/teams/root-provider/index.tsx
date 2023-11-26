import React from "react";
import { queryClient } from "@teams/core/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export const ModuleTeamRootProviders: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
