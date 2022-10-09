import React from "react";
import { PhotosList, usePhotos } from "./components/photo";

export const App = () => {
  const { photos } = usePhotos();

  return <PhotosList photos={photos} />;
};
