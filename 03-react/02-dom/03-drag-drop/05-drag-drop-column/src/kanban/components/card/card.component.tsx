import React from "react";
import { useRef } from "react";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
import { GhostCard } from "../ghost-card.component/ghost-card.component";
import { useCardDragHook } from "./card-drag.hook";
import { useCardDropHook } from "./card-drop.hook";

interface Props {
  columnId: number;
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content, columnId } = props;
  const ref = useRef(null);

  const { dragging } = useCardDragHook(ref, content);
  const { isDraggedOver } = useCardDropHook(ref, { columnId, content });

  return (
    <div ref={ref}>
      <GhostCard show={isDraggedOver} />
      <div
        className={classes.card}
        style={{
          opacity: dragging ? 0.4 : 1,
          background: isDraggedOver ? "lightblue" : "white",
        }}
      >
        {content.title}
      </div>
    </div>
  );
};
