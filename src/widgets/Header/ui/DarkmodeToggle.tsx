"use client";
import { useState } from "react";
import { motion } from "motion/react";

import SunIcon from "public/assets/svg/sun-icon.svg";
import MoonIcon from "public/assets/svg/moon-icon.svg";
import { CommonButton } from "shared/ui";

export const DarkmodeToggle = () => {
  const [isClick, setIsClick] = useState(false);
  const handleClick = () => setIsClick((prev) => !prev);

  return (
    <div className="relative">
      <CommonButton
        onClick={handleClick}
        className={`flex items-center justify-around px-[6px] w-[40px] h-[20px] rounded-full ${isClick ? "bg-black-200" : "bg-black-FFF shadow-innerShadow"}`}
      >
        <SunIcon />
        <MoonIcon />
      </CommonButton>
      <motion.div
        className={`absolute w-[14px] h-[14px] rounded-full pointer-events-none ${isClick ? "bg-black-FFF top-[3px] left-[3px]" : "bg-black-200 top-[3px] right-[3px]"}`}
        animate={{
          left: isClick ? "3px" : "auto",
          right: isClick ? "auto" : "3px",
        }}
        transition={{
          duration: 0.2,
        }}
        initial={false}
      />
    </div>
  );
};
