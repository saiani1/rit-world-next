"use client";
import { useState, useEffect } from "react";

export const useBreakpoint = (breakpoint: number) => {
  const [isAbove, setIsAbove] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsAbove(window.innerWidth >= breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isAbove;
};
