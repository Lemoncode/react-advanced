import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./core/queries";
import { CharacterFilterProvider } from "@/core/providers/character-filter";

export const App = () => {
  return (
    <CharacterFilterProvider>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<CharacterCollectionPage />} />
          <Route path="/:characterId" element={<CharacterDetailPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
    </CharacterFilterProvider>
  );
};
