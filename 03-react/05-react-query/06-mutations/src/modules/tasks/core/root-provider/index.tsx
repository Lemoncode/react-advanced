import React from "react";
import { queryClient } from "@tasks/core/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}

export const ModuleTasksRootProviders: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
