"use client";
import { CommonButton } from "./CommonButton";

type HashtagType = React.ComponentProps<"button"> & {
  page?: string;
  className?: string;
};

export const Hashtag = ({ page, className, ...rest }: HashtagType) => {
  return (
    <li>
      <CommonButton
        className={`${className} ${page ? "px-[14px] py-[2px] border border-white/60 font-semibold cursor-default" : "px-[10px] bg-purple-100"} flex items-center rounded-full text-white whitespace-nowrap h-[24px] text-[13px]`}
        {...rest}
      >
        {rest.name}
      </CommonButton>
    </li>
  );
};
