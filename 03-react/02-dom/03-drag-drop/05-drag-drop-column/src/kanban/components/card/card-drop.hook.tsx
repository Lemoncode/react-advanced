import React from "react";
import { useEffect, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import invariant from "tiny-invariant";

interface DropInfo {
  columnId: number;
  content: CardContent;
}

export const useCardDropHook = (
  ref: React.MutableRefObject<null>,
  dropInfo: DropInfo
) => {
  const { content, columnId } = dropInfo;
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: content.id }),
      canDrop: ({ source }) => source.data.dragType === "CARD",
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  return { isDraggedOver };
};
