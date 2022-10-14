import React from "react";
import { ReactPortalComponent } from "./common/components/react-portal.component";
import { Modal } from "./common/components/modal";
import { CSSTransition } from "react-transition-group";

export const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const nodeRef = React.useRef();

  return (
    <div>
      <h1> Hello React !!</h1>
      <button onClick={handleOpen}>Click to Open Modal</button>
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
              This is Modal Content!
            </Modal>
          </div>
        </CSSTransition>
      </ReactPortalComponent>
    </div>
  );
};
