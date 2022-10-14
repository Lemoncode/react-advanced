import React from "react";
import {
  createDefaultKanbanContent,
  DragItemInfo,
  KanbanAction,
  KanbanState,
} from "../model";
import { kanbanReducer } from "./kanban.reducer";

export interface KanbanContextModel {
  kanbanContent: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
}

export const KanbanContext = React.createContext<KanbanContextModel>(null);
