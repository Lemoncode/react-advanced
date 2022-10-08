import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
import { useScroll, useSpring } from "framer-motion";

export const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  const [currentPosition, setcurrentPosition] = React.useState(0);

  React.useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setcurrentPosition(latest);
      //setcurrentPosition(scaleX.get());
    });
  }, []);

  return (
    <>
      <ProgressBar progress={currentPosition} />
      <LoremIpsum />
    </>
  );
};
