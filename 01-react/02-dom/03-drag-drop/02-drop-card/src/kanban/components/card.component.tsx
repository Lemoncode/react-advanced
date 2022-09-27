import React from "react";
import { useDrag } from "react-dnd";
import { CardContent, ItemTypes, createDragItemInfo } from "../model";
import classes from "./card.component.css";

interface Props {
  content: CardContent;
  columnId: number;
}

export const Card = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { content, columnId } = props;

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content),
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del
      // card que está fijo (el elegido para el drag, para que el usuario se de cuenta)
      // de que item está arrastrando
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  return (
    <div ref={ref}>
      <div ref={preview} className={classes.card}>
        <div ref={drag} className={classes.dragHandle} style={{ opacity }} />
        {content.title}
      </div>
    </div>
  );
});
