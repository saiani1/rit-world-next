"use client";
import { motion } from "framer-motion";

type ErrorMsgType = {
  message: string | undefined;
};

export const ErrorMsg = ({ message }: ErrorMsgType) => {
  return (
    <motion.span layout className="ml-[10px] text-[12px] text-red-600">
      {message}
    </motion.span>
  );
};
