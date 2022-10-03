import { Character } from "./model";

// add random value to simulate network latency (bad connection), between 1 and 5 seconds
const randomLatency = () => Math.floor(Math.random() * 5 + 1) * 1000;

export const getCharacterCollection = async (
  filter: string
): Promise<Character[]> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${filter}`
  );
  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, randomLatency()));
  console.log(data.results);
  return data.results;
};