"use client";
import { useState, useEffect } from "react";
import { HASHTAG_COLOR_ARR } from "shared/model/constants";
import { useRouter } from "next/navigation";

export const Hashtag = ({
  tagName,
  size,
  disabled,
  hasBorder,
  colorIdx,
  url,
}: {
  tagName: string;
  size: "s" | "m";
  disabled?: boolean;
  hasBorder?: boolean;
  colorIdx?: number;
  url?: string;
}) => {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const { bgColor, color } = HASHTAG_COLOR_ARR[idx] || {};

  useEffect(() => {
    if (colorIdx) setIdx(colorIdx);
    else setIdx(Math.floor(Math.random() * HASHTAG_COLOR_ARR.length));
  }, []);

  const handleClick = () => {
    if (!disabled && url) router.push(url);
  };

  return (
    <li>
      <div
        className={`flex items-center px-[10px] rounded-full font-medium ${size === "s" ? "h-[17px] text-[11px]" : "h-[21px] text-[13px]"} ${hasBorder ? "shadow-commonShadow border-[1.5px] border-black-FFF" : ""} ${bgColor} ${color}`}
        onClick={handleClick}
      >
        <span>{tagName}</span>
      </div>
    </li>
  );
};
