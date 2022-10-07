import React from "react";
import classes from "./toggle-button.component.css";
import { motion } from "framer-motion";

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

interface Props {
  on: boolean;
  onToggle: () => void;
}

export const ToggleButton: React.FC<Props> = (props) => {
  const { on, onToggle } = props;

  return (
    <div className={classes.container} data-isOn={on} onClick={onToggle}>
      <motion.div layout className={classes.marble} transition={spring} />
    </div>
  );
};
