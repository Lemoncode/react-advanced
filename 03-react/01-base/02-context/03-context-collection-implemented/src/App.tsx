import { HashRouter, Routes, Route } from "react-router-dom";
import { CharacterCollectionContextProvider } from "@/core/providers/character-collection";
import { CharacterCollectionPage, CharacterDetailPage } from "./pages";
import { SpinnerComponent } from "@/common/components/spinner";
import { CharacterFilterProvider } from "./core/providers/character-filter/character-filter.provider";

export const App = () => {
  return (
    <>
      <CharacterFilterProvider>
        <CharacterCollectionContextProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<CharacterCollectionPage />} />
              <Route path="/:characterId" element={<CharacterDetailPage />} />
            </Routes>
          </HashRouter>
        </CharacterCollectionContextProvider>
      </CharacterFilterProvider>

      <SpinnerComponent />
    </>
  );
};
