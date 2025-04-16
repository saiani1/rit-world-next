"use client";
import { CommonButton } from "./CommonButton";

type HashtagType = React.ComponentProps<"button"> & {
  size: "s" | "m";
  colorIdx?: number;
};

export const Hashtag = ({ size, ...rest }: HashtagType) => {
  return (
    <li>
      <CommonButton
        className={`flex items-center px-[10px] rounded-full bg-purple-100 text-white whitespace-nowrap ${size === "s" ? "h-[20px] text-[11px]" : "h-[24px] text-[13px]"}`}
        {...rest}
      >
        {rest.name}
      </CommonButton>
    </li>
  );
};
