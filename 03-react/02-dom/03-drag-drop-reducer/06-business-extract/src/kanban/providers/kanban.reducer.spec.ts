import { KanbanState, ActionTypes, createDefaultKanbanState } from "../model";
import { kanbanReducer } from "./kanban.reducer";

describe("KanbanReducer", () => {
  it("should handle SET_KANBAN_CONTENT", () => {
    const initialState: KanbanState = createDefaultKanbanState();

    const state: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    };

    const newState = kanbanReducer(initialState, {
      type: ActionTypes.SET_KANBAN_CONTENT,
      payload: state,
    });

    expect(newState).toEqual(state);
  });

  it("should handle MOVE_CARD from column 1 to column 2", () => {
    const initialState: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
        {
          id: 2,
          name: "Column 2",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const state: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column 1",
          content: [],
        },
        {
          id: 2,
          name: "Column 2",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
      ],
    };

    const newState = kanbanReducer(initialState, {
      type: ActionTypes.MOVE_CARD,
      payload: {
        columnDestinationId: 2,
        dropCardId: 2,
        dragItemInfo: {
          columnId: 1,
          content: {
            id: 1,
            title: "Card 1",
          },
        },
      },
    });
    expect(newState).toEqual(state);
  });
});
