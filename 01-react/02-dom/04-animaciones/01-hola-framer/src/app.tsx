import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export const App = () => {
  const controls = useAnimation();

  const handleAnimation = () => {
    controls.start({
      scale: [1, 1.5, 1],
    });
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div className="caja" animate={controls}>
        <h1>Hello React !!</h1>
      </motion.div>
      <button onClick={handleAnimation}>Bigger smaller !</button>
    </div>
  );
};
