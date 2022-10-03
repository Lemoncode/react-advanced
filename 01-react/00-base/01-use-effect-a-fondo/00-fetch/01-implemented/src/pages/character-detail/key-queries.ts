export const characterDetailKeys = {
  all: ["character-detail"] as const,
  characterDetail: (id: string) =>
    [...characterDetailKeys.all, "character-profile", id] as const,
};
