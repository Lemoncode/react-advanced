import { useQuery } from "@tanstack/react-query";
import { getCharacterCollection } from "./character-collection.api";
import { Character } from "./model";
import { coreKeys } from "./key-queries";

export const useCharacterCollectionQuery = (filter: string) => {
  return useQuery(coreKeys.characterCollection(filter), () =>
    getCharacterCollection(filter)
  );
};
