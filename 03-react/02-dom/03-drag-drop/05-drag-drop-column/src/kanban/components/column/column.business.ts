export const calculateBackgroundColor = (
  dragging: boolean,
  isDraggedOver: boolean
) => {
  if (dragging) {
    return "white";
  }
  if (isDraggedOver) {
    return "lightblue";
  }
  return "aliceblue";
};
