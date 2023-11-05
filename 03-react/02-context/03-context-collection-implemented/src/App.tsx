import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionContextProvider } from "@/core/providers/character-collection";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
import { SpinnerComponent } from "@/common/components/spinner";

export const App = () => {
  return (
    <>
      <CharacterCollectionContextProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<CharacterCollectionPage />} />
            <Route path="/:characterId" element={<CharacterDetailPage />} />
          </Routes>
        </HashRouter>
      </CharacterCollectionContextProvider>
      <SpinnerComponent />
    </>
  );
};
