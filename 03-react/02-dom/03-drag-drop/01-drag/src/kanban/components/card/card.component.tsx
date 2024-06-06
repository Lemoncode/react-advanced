import React from "react";
import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
import invariant from "tiny-invariant";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;
  const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    <div
      ref={ref}
      className={classes.card}
      style={{ opacity: dragging ? 0.4 : 1 }}
    >
      {content.title}
    </div>
  );
};
