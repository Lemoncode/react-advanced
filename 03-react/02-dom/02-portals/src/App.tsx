import "./App.css";
import { ReactPortalComponent } from "./common/components/react-portal.component";
import { Modal } from "./common/components/modal";
import React from "react";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <h1>React Boiler plate</h1>
      <button onClick={handleOpen}>Click to Open Modal</button>
      <ReactPortalComponent wrapperId="lastnode">
        <Modal handleClose={handleClose} isOpen={isOpen}>
          <div style={{ background: "white" }}>This is Modal Content!</div>
        </Modal>
      </ReactPortalComponent>
    </div>
  );
}

export default App;
