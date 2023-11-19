import React from "react";
import { motion, MotionValue } from "framer-motion";
import classes from "./progress-bar.component.css";

interface Props {
  progress: MotionValue<number>;
}

export const ProgressBar = ({ progress }: Props) => {
  return (
    <>
      <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className={classes.backgroundCircle}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className={classes.indicatorCircle}
          style={{ pathLength: progress }}
        />
      </svg>
      <motion.div
        className={classes.progressBar}
        style={{
          scaleX: progress,
        }}
      />
    </>
  );
};
