export const coreKeys = {
  all: ["core"] as const,
  characterCollection: (filter: string) =>
    [...coreKeys.all, "core", "character-collection", filter] as const,
};
