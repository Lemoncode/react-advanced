import React from "react";
import { useDrop } from "react-dnd";
import classes from "./column.component.css";
import { CardContent, ItemTypes, DragItemInfo } from "../model";
import { Card } from "./card.component";
import { KanbanContext } from "../providers/kanban.context";
import {
  CardDivKeyValue,
  getArrayPositionBasedOnCoordinates,
} from "./column.business";

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
        rootRef.current,
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

  const rootRef = React.useRef<CardDivKeyValue>(null);

  const itemsRef = React.useMemo(() => {
    const newItemsRef = content.reduce<CardDivKeyValue>(
      (cardRefs, item) => ({
        ...cardRefs,
        [item.id]: React.createRef(),
      }),
      {}
    );

    rootRef.current = newItemsRef;

    return newItemsRef;
  }, [props.content]);

  return (
    <div ref={drop} className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card
          ref={rootRef.current[card.id]}
          key={card.id}
          columnId={columnId}
          content={card}
        />
      ))}
    </div>
  );
};
