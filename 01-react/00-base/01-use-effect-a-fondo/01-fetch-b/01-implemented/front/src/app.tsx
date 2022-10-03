import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./core/query/query-client";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};
