import React from "react";
import { motion } from "framer-motion";

export const App = () => {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column" }}>
      <motion.div
        className="caja"
        animate={{ x: "calc(100vw - 100% - 30px)" }}
        transition={{ duration: 2 }}
      >
        <h1>Hello React !!</h1>
      </motion.div>
    </div>
  );
};
