"use client";
import { Link } from "i18n/routing";

type HashtagType = {
  page?: string;
  className?: string;
  name: string;
};

export const Hashtag = ({ page, className, name }: HashtagType) => {
  return (
    <Link
      href={{ pathname: "/", query: { hashtag: name } }}
      className={`${className} ${page ? "px-[14px] py-[2px] border border-white/60 font-semibold text-white cursor-default" : "px-[10px] bg-purple-50 text-purple-100"} flex items-center rounded-full whitespace-nowrap h-[24px] text-[13px]`}
    >
      {name}
    </Link>
  );
};
