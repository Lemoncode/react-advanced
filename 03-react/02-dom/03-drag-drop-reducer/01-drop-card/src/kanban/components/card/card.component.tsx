import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  CardContent,
  ItemTypes,
  createDragItemInfo,
  DragItemInfo,
} from "../../model";
import { KanbanContext } from "../../providers/kanban.context";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
  columnId: number;
}

export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;
  const { moveCard, kanbanContent } = React.useContext(KanbanContext);

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, _) => {
        moveCard(columnId, content.id, item);

        return {
          name: `DropColumn`,
        };
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [kanbanContent]
  );

  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content), // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  return (
    <div ref={drop}>
      <div ref={ref}>
        <div ref={drag} className={classes.card} style={{ opacity }}>
          {content.title}
        </div>
      </div>
    </div>
  );
});
