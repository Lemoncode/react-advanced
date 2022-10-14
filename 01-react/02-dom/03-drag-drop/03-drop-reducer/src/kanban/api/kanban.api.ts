import { CardContent, KanbanState } from "../model";
import { mockData } from "./mock-data";

export const loadKanbanContent = async (): Promise<KanbanState> => {
  return mockData;
};
