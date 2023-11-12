import React from "react";
import { useDrag } from "react-dnd";
import { CardContent, ItemTypes, createDragItemInfo } from "../../model";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
  columnId: number;
}

export const Card: React.FC<Props> = (props) => {
  const { content, columnId } = props;

  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content), // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  return (
    <div ref={drag} className={classes.card} style={{ opacity }}>
      {content.title}
    </div>
  );
};
