import React from "react";
import "./App.css";
import { ReactPortalComponent } from "./common/components/react-portal.component";
import { Modal } from "./common/components/modal";
import { CSSTransition } from "react-transition-group";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const nodeRef = React.useRef(null);

  return (
    <>
      <ReactPortalComponent wrapperId="lastnode">
        <CSSTransition
          in={isOpen}
          timeout={{ enter: 0, exit: 300 }}
          unmountOnExit
          classNames="modal"
          nodeRef={nodeRef}
        >
          <div className="modal" ref={nodeRef}>
            <Modal handleClose={handleClose} isOpen={isOpen}>
              <div style={{ background: "white" }}>This is Modal Content!</div>
            </Modal>
          </div>
        </CSSTransition>
      </ReactPortalComponent>
      <h1>React App Boilerplate</h1>
      <h2> Sub title</h2>
      <button onClick={handleOpen}>Click to Open Modal</button>
    </>
  );
}

export default App;
