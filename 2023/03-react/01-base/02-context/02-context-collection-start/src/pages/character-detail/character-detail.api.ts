import { Character } from "./character-detail.model";

export const getCharacter = (id: string): Promise<Character> => {
  return fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then((response) => response.json())
    .then((data) => data);
};
