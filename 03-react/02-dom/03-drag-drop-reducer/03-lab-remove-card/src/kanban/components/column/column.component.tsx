import React from "react";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";

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
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
