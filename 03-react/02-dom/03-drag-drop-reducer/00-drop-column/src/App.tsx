import "./App.css";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { KanbanContainer } from "./kanban";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <KanbanContainer />
    </DndProvider>
  );
}

export default App;
