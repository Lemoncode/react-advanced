import { useEffect, useRef, useState } from "react";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const ref = useRef(null);
  const { name, content, columnId } = props;
  const [dragging, setDragging] = useState<boolean>(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ dragType: "COLUMN", columnOriginId: columnId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ ColumnDestinationId: columnId }),
      canDrop: ({ source }) => source.data.dragType === "COLUMN",
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const calculateBackgroundColor = () => {
    if (dragging) {
      return "white";
    }
    if (isDraggedOver) {
      return "lightblue";
    }
    return "aliceblue";
  };

  return (
    <div
      className={classes.container}
      ref={ref}
      style={{ background: calculateBackgroundColor() }}
    >
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} columnId={columnId} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
