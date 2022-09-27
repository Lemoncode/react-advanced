import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
import { KanbanContext } from "../providers/kanban.context";
import { getArrayPositionBasedOnCoordinates } from "./column.business";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  const { moveCard } = React.useContext(KanbanContext);

  const [collectedProps, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: DragItemInfo, monitor) => {
      const index = getArrayPositionBasedOnCoordinates(
        itemsRef.current,
        monitor.getClientOffset()
      );

      moveCard(columnId, index, item);

      return {
        name: `DropColumn`,
      };
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const itemsRef = React.useRef<HTMLDivElement[]>([]);

  itemsRef.current = [];

  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card, idx) => (
        <Card
          ref={(ref) => (itemsRef.current[idx] = ref)}
          key={card.id}
          columnId={columnId}
          content={card}
        />
      ))}
    </div>
  );
};
