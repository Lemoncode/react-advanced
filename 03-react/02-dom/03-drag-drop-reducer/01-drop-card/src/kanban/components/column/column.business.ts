import { XYCoord } from "react-dnd";

export const getArrayPositionBasedOnCoordinates = (
  cardDivElements: HTMLDivElement[],
  offset: XYCoord
) => {
  // Por defecto añadimos en la última
  let position = cardDivElements.length;

  // Iteramos por el objeto de refs
  cardDivElements.forEach((item, index) => {
    const cardDiv = item;
    const cardDivPosition = cardDiv.getBoundingClientRect();

    // Si una card está en la zona de drop le decimos que coloque la
    // nueva justo debajo
    // Esto se podría optimizar y para el bucle aquí
    if (offset.y > cardDivPosition.top && offset.y < cardDivPosition.bottom) {
      position = index + 1; // NextPosition
    }
  });

  return position;
};
