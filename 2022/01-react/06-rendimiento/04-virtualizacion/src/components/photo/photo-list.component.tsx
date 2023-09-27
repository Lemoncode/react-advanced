import React from "react";
import { usePhotos } from "./use-photos.hook";
import { PhotoCard } from "./photo-card.component";
import classes from "./photo-list.component.css";
import { Photo } from "./photo.model";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface Props {
  photos: Photo[];
}

export const PhotosList: React.FC<Props> = (props) => {
  const { photos } = props;

  if (!photos) {
    return null;
  }

  return (
    <div className={classes.container}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            width={width}
            height={height}
            itemCount={photos.length}
            itemSize={200}
          >
            {({ index, style }) => {
              const photo = photos[index];
              return <PhotoCard key={photo.id} photo={photo} style={style} />;
            }}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
};
