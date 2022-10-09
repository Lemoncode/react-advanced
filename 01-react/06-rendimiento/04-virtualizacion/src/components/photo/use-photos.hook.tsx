import { useEffect, useState } from "react";
import { Photo } from "./photo.model";

export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=1000")
      .then((response) => response.json())
      .then((photosData) => {
        setPhotos(photosData);
      });
  }, []);

  return {
    photos,
  };
};
