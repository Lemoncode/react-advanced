import React from "react";
import { CardContent, ActionTypes } from "../../model";
import { useKanbanContext } from "../../providers/kanban.context";
import classes from "./card.component.module.css";
import { useCardDragDrop } from "./card-drag-drop.hook";

interface Props {
  content: CardContent;
  columnId: number;
}

export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
  const { dispatch } = useKanbanContext();

  const { drag, drop, opacity } = useCardDragDrop(columnId, content);

  const handleDeleteCard = () => {
    dispatch({
      type: ActionTypes.DELETE_CARD,
      payload: {
        columnId: columnId,
        cardId: content.id,
      },
    });
  };

  return (
    <div ref={drop}>
      <div ref={ref}>
        <div ref={drag} className={classes.card} style={{ opacity }}>
          {content.title}
          <button onClick={handleDeleteCard}>Borrar</button>
        </div>
      </div>
    </div>
  );
});
