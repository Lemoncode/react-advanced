import { useEffect, useState } from "react";
import {
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export const useColumnDragHook = (
  ref: React.MutableRefObject<null>,
  columnId: number
) => {
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ dragType: "COLUMN", columnOriginId: columnId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return {
    dragging,
  };
};
