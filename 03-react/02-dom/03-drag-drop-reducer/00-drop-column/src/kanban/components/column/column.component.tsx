import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.module.css";
import { CardContent, ItemTypes, DragItemInfo } from "../../model";
import { Card } from "../card/card.component";
import { useKanbanContext } from "../../providers/kanban.context";

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
      drop: (item: DragItemInfo, _) => {
        moveCard(columnId, item);

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

  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
    </div>
  );
};
