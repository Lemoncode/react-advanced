import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.module.css";
import { CardContent, ItemTypes, DragItemInfo } from "../../model";
import { Card } from "../card/card.component";
import { useKanbanContext } from "../../providers/kanban.context";
import { getArrayPositionBasedOnCoordinates } from "./column.business";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  const { moveCard } = useKanbanContext();

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, monitor) => {
        const index = getArrayPositionBasedOnCoordinates(
          itemsRef.current,
          monitor.getClientOffset() ?? { x: 0, y: 0 }
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
    }),
    [content]
  );

  const itemsRef = React.useRef<HTMLDivElement[]>([]);
  itemsRef.current = [];

  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card, idx) => (
        <Card
          key={card.id}
          ref={(ref) => (itemsRef.current[idx] = ref!)}
          columnId={columnId}
          content={card}
        />
      ))}
    </div>
  );
};
