import React from "react";
import { CSSTransition } from "react-transition-group";

interface Props {
  inProp: boolean;
  render: (animationInProgress: boolean) => JSX.Element;
}

export const AnimationWrapper: React.FC<Props> = (props) => {
  const { inProp, render } = props;
  const [animationInProgress, setAnimationInProgress] = React.useState(false);

  return (
    <CSSTransition
      in={inProp}
      classNames={{
        enter: "animate__animated animate__flipInX",
        exit: "animate__animated animate__flipOutX",
      }}
      timeout={500}
      onEnter={() => setAnimationInProgress(true)}
      onEntered={() => setAnimationInProgress(false)}
      onExit={() => setAnimationInProgress(true)}
      onExited={() => setAnimationInProgress(false)}
    >
      {render(animationInProgress)}
    </CSSTransition>
  );
};
