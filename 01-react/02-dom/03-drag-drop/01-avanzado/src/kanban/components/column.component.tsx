import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes } from "../model";
import { Card } from "./card.component";

interface Props {
  name: string;
  content: CardContent[];
  onAddCard: (card: CardContent) => void;
}

export const Column: React.FC<Props> = (props) => {
  const { name, content, onAddCard } = props;

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: CardContent, monitor) => {
      onAddCard(item);

      return {
        name: `DropColumn`,
      };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} />
      ))}
    </div>
  );
};
