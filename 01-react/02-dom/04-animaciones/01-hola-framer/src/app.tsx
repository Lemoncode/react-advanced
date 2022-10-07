import React from "react";
import { motion } from "framer-motion";

export const App = () => {
  const [myScale, setMyScale] = React.useState(1);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div className="caja" animate={{ scale: myScale }}>
        <h1>Hello React !!</h1>
      </motion.div>
      <button onClick={() => setMyScale(1.5)}>Grow !</button>
      <button onClick={() => setMyScale(1)}>Shrink !</button>
    </div>
  );
};
