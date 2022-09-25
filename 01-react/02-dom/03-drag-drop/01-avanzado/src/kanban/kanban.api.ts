import { CardContent, KanbanContent } from "./model";
import { mockData } from "./mock-data";

export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
