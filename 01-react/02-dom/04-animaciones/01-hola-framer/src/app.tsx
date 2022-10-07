import React from "react";
import { motion } from "framer-motion";

export const App = () => {
  return (
    <motion.div className="caja" whileHover={{ scale: 1.2 }}>
      <h1>Hello React !!</h1>
    </motion.div>
  );
};
