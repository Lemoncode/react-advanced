import { XYCoord } from "react-dnd";

// Movemos el type tb
export type CardDivKeyValue = {
  [key: string]: React.MutableRefObject<HTMLDivElement>;
};

export const getArrayPositionBasedOnCoordinates = (
  cardDivElements: CardDivKeyValue,
  offset: XYCoord
) => {
  // Por defecto añadimos en la última
  let position = Object.keys(cardDivElements).length;

  // Iteramos por el objeto de refs
  Object.keys(cardDivElements).forEach((key, index) => {
    const cardDiv = cardDivElements[key];
    const cardDivPosition = cardDiv.current.getBoundingClientRect();

    // Si una card está en la zona de drop le decimos que coloque la
    // nueva justo debajo
    // Esto se podría optimizar y para el bucle aquí
    if (offset.y > cardDivPosition.top && offset.y < cardDivPosition.bottom) {
      position = index + 1; // NextPosition
    }
  });

  return position;
};
