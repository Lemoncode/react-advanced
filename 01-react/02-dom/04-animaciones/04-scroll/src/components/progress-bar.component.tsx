import React from "react";
import { motion } from "framer-motion";
import classes from "./progress-bar.component.css";

interface Props {
  progress: number; // Value in between 0 and 1
}

export const ProgressBar = ({ progress }: Props) => {
  return (
    <motion.div
      className={classes.progressBar}
      style={{
        scaleX: progress,
      }}
    />
  );
};
