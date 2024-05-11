import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { KanbanContainer, KanbanProvider } from "./kanban";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanProvider>
        <KanbanContainer />
      </KanbanProvider>
    </DndProvider>
  );
}

export default App;
