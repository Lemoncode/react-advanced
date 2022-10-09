import React, { FunctionComponent } from "react";
import { Photo } from "./photo.model";
import classes from "./photo-card.component.css";

interface Props {
  photo: Photo;
}

export const PhotoCard: FunctionComponent<Props> = ({ photo }) => {
  return (
    <div className={classes.container}>
      <a href={photo.url}>
        <img src={photo.thumbnailUrl} alt={photo.title} />
      </a>
      <p>{photo.title}</p>
    </div>
  );
};
