import React from "react";
import "./loader.scss";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  position?: string;
  center?: boolean;
}

const Loader = ({ position, center }: Props) => {
  return (
    <AnimatePresence>
      <motion.span
        className={`loader ${
          position === "relative" ? "relative" : "absolute"
        } ${center && "center"}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
      ></motion.span>
    </AnimatePresence>
  );
};

export default Loader;
