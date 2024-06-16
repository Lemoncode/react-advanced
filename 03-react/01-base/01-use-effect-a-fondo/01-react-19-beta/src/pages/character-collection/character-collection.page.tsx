import React, { Suspense, use } from "react";
import { Link } from "react-router-dom";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./character-collection.model";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal, reintenta de nuevo</h2>;
    }

    return this.props.children;
  }
}

export const CharacterCollectionPage = () => {
  const characterPromise = getCharacterCollection();

  return (
    <>
      <h1>Character Collection</h1>
      <Link to="/1">Character 1</Link>
      <ErrorBoundary>
        <Suspense fallback={<div>Cargando datos...</div>}>
          <CharacterCollectionInnerPage charactersPromise={characterPromise} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

interface Props {
  charactersPromise: Promise<Character[]>;
}

export const CharacterCollectionInnerPage = ({ charactersPromise }: Props) => {
  const characters = use<Promise<Character[]>>(charactersPromise);

  return (
    <ul>
      {characters.map((character: any) => (
        <li key={character.id}>
          <Link to={`/${character.id}`}>{character.name}</Link>
        </li>
      ))}
    </ul>
  );
};
