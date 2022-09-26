import React from "react";
import { useDrag } from "react-dnd";
import { CardContent, ItemTypes } from "../model";
import classes from "./card.component.css";

interface Props {
  content: CardContent;
  onRemoveCard: (cardContent: CardContent) => void;
}

export const Card: React.FC<Props> = (props) => {
  const { content, onRemoveCard } = props;

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: content, // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del
      // card que está fijo (el elegido para el drag, para que el usuario se de cuenta)
      // de que item está arrastrando
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    end: (item, monitor) => {
      // Una vez que ha concluido el drag, si el drop ha sido exitoso, mostramos un mensaje
      if (monitor.didDrop) {
        onRemoveCard(content);
      }
    },
  }));

  return (
    <div ref={preview} className={classes.card}>
      <div ref={drag} className={classes.dragHandle} style={{ opacity }} />
      {content.title}
    </div>
  );
};
