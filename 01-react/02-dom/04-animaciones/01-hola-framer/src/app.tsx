import React from "react";
import { motion } from "framer-motion";

export const App = () => {
  return (
    <motion.div
      className="caja"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>Hello React !!</h1>
    </motion.div>
  );
};
