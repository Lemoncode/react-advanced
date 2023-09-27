import React from "react";
import { KanbanAction, KanbanState } from "../model";

export interface KanbanContextModel {
  kanbanContent: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
}

export const KanbanContext = React.createContext<KanbanContextModel>(null);
