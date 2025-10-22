"use client";

import { motion } from "motion/react";
import React, { useEffect } from "react";
import { useIsEditMode } from "shared/index";

interface AnimatedContentWrapperProps {
  children: React.ReactNode;
}

export const AnimatedContentWrapper = ({
  children,
}: AnimatedContentWrapperProps) => {
  const isEditMode = useIsEditMode();

  return (
    <motion.div
      animate={{ width: isEditMode ? "100%" : "calc(100% - 250px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sm:pt-[105px] pt-[40px] sm:px-[50px] pb-[40px] w-full bg-black-10 sm:rounded-xl"
    >
      {children}
    </motion.div>
  );
};
