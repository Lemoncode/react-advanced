import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
  onMoveCard: (card: DragItemInfo) => void;
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content, onMoveCard } = props;

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
      onMoveCard(item);

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
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
    </div>
  );
};
