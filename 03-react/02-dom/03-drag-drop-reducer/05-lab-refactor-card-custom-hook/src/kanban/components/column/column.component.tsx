import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";
import classes from "./column.component.module.css";
import { ActionTypes, CardContent, ItemTypes } from "../../model";
import { Card } from "../card/card.component";
import { useKanbanContext } from "@/kanban/providers";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { columnId, name, content } = props;
  const { kanbanContent, dispatch } = useKanbanContext();

  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.COLUMN, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: { columnId }, // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.COLUMN,
      drop: (item: { columnId: number }, _) => {
        dispatch({
          type: ActionTypes.MOVE_COLUMN,
          payload: {
            sourceColumnId: item.columnId,
            targetColumnId: columnId,
          },
        });

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

  return (
    <div className={classes.container} ref={drag} style={{ opacity }}>
      <div className={classes.columnHeader} ref={drop}>
        <h4>{name}</h4>
      </div>
      {content.map((card) => (
        <Card key={card.id} columnId={columnId} content={card} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
