import { Character } from "./character-collection.model";

// add random value to simulate network latency (bad connection), between 1 and 3 seconds
const randomLatency = () => Math.floor(Math.random() * 3 + 1) * 1000;

export const getCharacterCollection = async (): Promise<Character[]> => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};
