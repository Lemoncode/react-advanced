import { useEffect, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export const useDropHook = (ref: React.MutableRefObject<null>, columnId: number) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    
    useEffect(() => {
        const el = ref.current;
        invariant(el);
    
        return dropTargetForElements({
        element: el,
        getData: () => ({ ColumnDestinationId: columnId }),
        canDrop: ({ source }) => source.data.dragType === "COLUMN",
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        });
    }, []);
    
    return {
        isDraggedOver,
    };
}