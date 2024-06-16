import { KanbanState } from "../model";
import { mockData } from "./mock-data";

// TODO: Move this outside kanban component folder
export const loadKanbanContent = async (): Promise<KanbanState> => {
  return mockData;
};
