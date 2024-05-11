import {
  ActionTypes,
  CardContent,
  DragItemInfo,
  ItemTypes,
  createDragItemInfo,
} from "@/kanban/model";
import { useDrag, useDrop } from "react-dnd";
import { useKanbanContext } from "../../providers/kanban.context";

export const useCardDragDrop = (columnId: number, content: CardContent) => {
  const { kanbanContent, dispatch } = useKanbanContext();

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, _) => {
        dispatch({
          type: ActionTypes.MOVE_CARD,
          payload: {
            columnDestinationId: columnId,
            dropCardId: content.id,
            dragItemInfo: item,
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

  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CARD, // Definimos que es de tipo CARD esto lo usaremos en el drop
    item: createDragItemInfo(columnId, content), // Aquí le pasamos el contenido de la card, así en el drop tenemos toda la info
    collect: (monitor) => ({
      // En esta función monitorizamos el estado del drag y cambiamos la opacidad del card
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  return { drag, drop, opacity };
};
