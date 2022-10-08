import React, { useRef } from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
import { useScroll } from "framer-motion";
import classes from "./app.css";

export const App = () => {
  const refDivTextA = useRef(null);
  const refDivTextB = useRef(null);
  const { scrollYProgress: scrollYProgressA } = useScroll({
    container: refDivTextA,
  });
  const { scrollYProgress: scrollYProgressB } = useScroll({
    container: refDivTextB,
  });
  const [currentPositionA, setcurrentPositionA] = React.useState(0);
  const [currentPositionB, setcurrentPositionB] = React.useState(0);

  React.useEffect(() => {
    scrollYProgressA.onChange((latest) => {
      setcurrentPositionA(latest);
    });

    scrollYProgressB.onChange((latest) => {
      setcurrentPositionB(latest);
    });
  }, []);

  return (
    <div className={classes.container}>
      <div style={{ width: "200px" }}>
        <ProgressBar progress={currentPositionA} />
        <LoremIpsum ref={refDivTextA} />
      </div>
      <div style={{ width: "200px" }}>
        <ProgressBar progress={currentPositionB} />
        <LoremIpsum ref={refDivTextB} />
      </div>
    </div>
  );
};
