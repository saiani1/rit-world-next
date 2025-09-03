"use client";
import { useRef, useState } from "react";
import React from "react";
import { useLocale } from "next-intl";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { usePathname, useRouter } from "i18n/routing";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { langData } from "../model";
import { CommonButton } from "./CommonButton";

export const SelectLangBox = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const selectRef = useRef(null);
  const [isClick, setIsClick] = useState(false);

  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  const handleClickOption = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    if (locale === name) {
      setIsClick((prev) => !prev);
      return;
    }
    router.push({ pathname }, { locale: name });
  };

  useOnClickOutside(selectRef, () => setIsClick(false));

  return (
    <div className="relative inline-block shrink-0" ref={selectRef}>
      <CommonButton
        className="flex items-center gap-x-[15px] px-[14px] h-[34px] text-black-999 text-[13px] font-regular rounded-[5px] border border-black-AAA"
        onClick={handleClick}
      >
        <div className="flex items-center gap-x-1">
          {locale === "ko" ? "한국어" : "日本語"}
        </div>
        <ArrowIcon
          className={`transition-transform duration-200 ${isClick ? "" : "rotate-180"}`}
        />
      </CommonButton>
      {isClick && (
        <ul
          className="absolute top-[39px] left-0 text-center w-full z-10 bg-white text-black-999 text-[13px] divide-y divide-black-AAA divide-dashed rounded-[5px] border border-black-AAA"
          onClick={handleClickOption}
        >
          {langData.map((item, i) => (
            <li key={`lang-select-${i}`}>
              <CommonButton name={item.id} className="h-[34px] w-full">
                {item.title}
              </CommonButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
