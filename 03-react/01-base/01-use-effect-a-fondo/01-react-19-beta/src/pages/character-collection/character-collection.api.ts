import { Character } from "./character-collection.model";

export const getCharacterCollection = async (): Promise<Character[]> => {
  //const response = await fetch("https://rickandmortyapi.com/api/character");
  const response = await fetch("https://locahost:3434/crash");
  const data = await response.json();
  console.log(data.results);
  return data.results;
};
