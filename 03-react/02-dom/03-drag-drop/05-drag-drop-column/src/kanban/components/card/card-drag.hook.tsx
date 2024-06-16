import React from "react";
import { useEffect, useState } from "react";
import {
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import invariant from "tiny-invariant";

export const useCardDragHook = (ref:  React.MutableRefObject<null>, content: CardContent) => {
    const [dragging, setDragging] = useState<boolean>(false);

    useEffect(() => {
        const el = ref.current;
    
        invariant(el);
    
        return draggable({
          element: el,
          getInitialData: () => ({ dragType: "CARD", card: content }),
          onDragStart: () => setDragging(true),
          onDrop: () => setDragging(false),
        });
      }, []);

    return {
        dragging
    }
}