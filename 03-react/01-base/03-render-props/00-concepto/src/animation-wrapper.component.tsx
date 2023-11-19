import React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  inProp: boolean;
  children: (animationInProgress: boolean) => JSX.Element;
}

export const AnimationWrapper: React.FC<Props> = (props) => {
  const { inProp, children } = props;
  const [animationInProgress, setAnimationInProgress] = React.useState(false);

  return (
    <CSSTransition
      in={inProp}
      classNames={{
        enter: "animate__animated animate__zoomIn",
        exit: "animate__animated animate__zoomOut",
      }}
      timeout={500}
      onEnter={() => setAnimationInProgress(true)}
      onEntered={() => setAnimationInProgress(false)}
      onExit={() => setAnimationInProgress(true)}
      onExited={() => setAnimationInProgress(false)}
    >
      {children(animationInProgress)}
    </CSSTransition>
  );
};
