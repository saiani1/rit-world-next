"use client";
import { Link } from "i18n/routing";
import { CommonButton } from "./CommonButton";

type HashtagType = {
  page?: string;
  className?: string;
  name: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Hashtag = ({ page, className, name, onClick }: HashtagType) => {
  const baseStyle =
    "flex items-center rounded-full whitespace-nowrap h-[24px] text-[13px]";
  if (page === "item")
    return (
      <Link
        href={{ pathname: "/", query: { hashtag: name } }}
        data-name={name}
        className={`${className} ${baseStyle} px-[10px] bg-purple-50 text-purple-100`}
      >
        {name}
      </Link>
    );

  return (
    <CommonButton
      name={name}
      onClick={onClick}
      className={`${className} ${baseStyle} ${page === "content" ? "px-[14px] py-[2px] border border-white/60 font-semibold text-white cursor-default" : "px-[10px] bg-purple-50 text-purple-100"}`}
    >
      {name}
    </CommonButton>
  );
};
