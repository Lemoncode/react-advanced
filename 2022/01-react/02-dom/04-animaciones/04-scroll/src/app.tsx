import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
import { useScroll } from "framer-motion";
import classes from "./app.css";

export const App = () => {
  const refDivTextA = React.useRef(null);
  const refDivTextB = React.useRef(null);

  const { scrollYProgress: scrollYProgressA } = useScroll({
    container: refDivTextA,
  });

  const { scrollYProgress: scrollYProgressB } = useScroll({
    container: refDivTextB,
  });

  return (
    <div className={classes.container}>
      <div style={{ width: "200px" }}>
        <ProgressBar progress={scrollYProgressA} />
        <LoremIpsum ref={refDivTextA} />
      </div>
      <div style={{ width: "200px" }}>
        <ProgressBar progress={scrollYProgressB} />
        <LoremIpsum ref={refDivTextB} />
      </div>
    </div>
  );
};
