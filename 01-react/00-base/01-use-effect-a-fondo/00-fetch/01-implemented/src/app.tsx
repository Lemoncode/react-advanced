import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./core/queries";
import {
  CharacterCollectionPage,
  CharacterDetailPage,
  AnotherPage,
} from "./pages";

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
          <Route path="/another" element={<AnotherPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};
