import React from "react";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
import { EmptySpaceDropZone } from "./empty-space-drop-zone.component";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card, idx) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
