import { useRef } from "react";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import { useColumnDragHook } from "./column-drag.hook";
import { useDropHook as useColumnDropHook } from "./column-drop.hook";
import { calculateBackgroundColor } from "./column.business";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const ref = useRef(null);
  const { name, content, columnId } = props;

  const { dragging } = useColumnDragHook(ref, columnId);
  const { isDraggedOver } = useColumnDropHook(ref, columnId);

  return (
    <div
      className={classes.container}
      ref={ref}
      style={{ background: calculateBackgroundColor(dragging, isDraggedOver) }}
    >
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} columnId={columnId} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
