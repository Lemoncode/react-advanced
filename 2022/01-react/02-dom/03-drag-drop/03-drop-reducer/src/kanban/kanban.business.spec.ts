import { moveCardColumn } from "./kanban.business";
import { KanbanState } from "./model";

describe("Kanban business", () => {
  it("should move card from one column to another", () => {
    const kanbanContent: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column A",
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
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
      cardIndex: 1,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });

  it("should move card from first column to third column", () => {
    const kanbanContent: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column A",
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
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [],
        },
      ],
    };

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 3,
      cardIndex: 1,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual({
      columns: [
        {
          id: 1,
          name: "Column A",
          content: [
            {
              id: 2,
              title: "Card 2",
            },
          ],
        },
        {
          id: 2,
          name: "Column B",
          content: [
            {
              id: 3,
              title: "Card 3",
            },
          ],
        },
        {
          id: 3,
          name: "Column C",
          content: [
            {
              id: 1,
              title: "Card 1",
            },
          ],
        },
      ],
    });
  });

  it("should return same state if destination does not exists", () => {
    const kanbanContent: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column A",
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

    const moveInfo = {
      columnOriginId: 1,
      columnDestinationId: 2,
      cardIndex: 0,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });

  it("should return same state if origin does not exists", () => {
    const kanbanContent: KanbanState = {
      columns: [
        {
          id: 1,
          name: "Column A",
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

    const moveInfo = {
      columnOriginId: 2,
      columnDestinationId: 1,
      cardIndex: 0,
      content: {
        id: 1,
        title: "Card 1",
      },
    };

    const newKanbanContent = moveCardColumn(moveInfo, kanbanContent);

    expect(newKanbanContent).toEqual(kanbanContent);
  });
});
