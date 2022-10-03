import { useQuery } from "@tanstack/react-query";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./model";

export const useCharacterCollectionQuery = (filter: string) => {
  return useQuery(["character-collection", filter], () =>
    getCharacterCollection(filter)
  );
};
