import { useInView } from "@sss/hooks";
import { motion } from "framer-motion";
import React, { FC } from "react";

const LazyAnimation: FC = ({ children }) => {
  const [ref, inView] = useInView({
    rootMargin: "-20% 0px",
    triggerOnce: true,
  });

  return (
    <motion.div
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        easing: "easeout",
      }}
      ref={ref}
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
    >
      {children}
    </motion.div>
  );
};

export default LazyAnimation;
