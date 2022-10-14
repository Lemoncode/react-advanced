import React from "react";
import { useDrop } from "react-dnd";
import { DragItemInfo, ItemTypes, ActionTypes } from "../model";
import { KanbanContext } from "../providers/kanban.context";

interface Props {
  columnId: number;
}

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const { kanbanContent, dispatch } = React.useContext(KanbanContext);

  const [collectedProps, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, monitor) => {
        dispatch({
          type: ActionTypes.MOVE_CARD,
          payload: {
            columnDestinationId: columnId,
            dropCardId: -1,
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

  return (
    <div
      ref={drop}
      style={{ flexGrow: 1, width: "100%", background: "blue" }}
    />
  );
};
