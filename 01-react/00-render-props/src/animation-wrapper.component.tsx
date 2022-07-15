import React from "react";
import { CSSTransition } from "react-transition-group";

interface Props{
  inProp: boolean;
  children: React.ReactNode;
}

export const AnimationWrapper : React.FC<Props> = (props) => {
  const { inProp, children } = props;

  return (
      <CSSTransition
        in={inProp}
        classNames={{
          enter: "animate__animated animate__flipInX",
          exit: "animate__animated animate__flipOutX",
        }}
        timeout={500}
      >
        {children}
      </CSSTransition>
  )
};
