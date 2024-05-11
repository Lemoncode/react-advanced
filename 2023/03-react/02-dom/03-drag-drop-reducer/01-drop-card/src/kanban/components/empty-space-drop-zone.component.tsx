import React from "react";
import { useDrop } from "react-dnd";
import { DragItemInfo, ItemTypes } from "../model";
import { KanbanContext } from "../providers/kanban.context";

interface Props {
  columnId: number;
}

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const { moveCard, kanbanContent } = React.useContext(KanbanContext);

  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: DragItemInfo, _) => {
        moveCard(columnId, -1, item);

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

  return <div ref={drop} style={{ flexGrow: 1, width: "100%" }} />;
};
