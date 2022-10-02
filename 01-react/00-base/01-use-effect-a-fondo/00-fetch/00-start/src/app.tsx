import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CharacterCollectionPage />} />
        <Route path="/:characterId" element={<CharacterDetailPage />} />
      </Routes>
    </HashRouter>
  );
};
