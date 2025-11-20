"use client";
import { useRef, useState } from "react";
import { useSetAtom } from "jotai";
import { useLocale, useTranslations } from "next-intl";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { useRouter } from "i18n/routing";
import { isClickMobileMenuAtom } from "features/Category";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { langData } from "../model";
import { CommonButton } from "./CommonButton";

type SelectLangBoxType = {
  isMobile?: boolean;
};

export const SelectLangBox = ({ isMobile }: SelectLangBoxType) => {
  const t = useTranslations("Locale");
  const locale = useLocale();
  const router = useRouter();
  const selectRef = useRef(null);
  const [isClick, setIsClick] = useState(false);
  const setIsClickMenu = useSetAtom(isClickMobileMenuAtom);

  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  const handleClickOption = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    if (locale === name) {
      setIsClick((prev) => !prev);
      return;
    }
    router.push("/", { locale: name });
    setIsClickMenu(false);
  };

  useOnClickOutside(selectRef, () => setIsClick(false));

  return (
    <div className="relative inline-block shrink-0" ref={selectRef}>
      <CommonButton
        className={`flex justify-between items-center gap-x-[15px] px-[14px] w-full ${isMobile ? "h-[40px] text-black-777 text-[18px]" : "h-[34px] text-black-999 text-[13px]"}  font-regular rounded-[5px] border border-black-AAA`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-x-1">{t("locale")}</div>
        <ArrowIcon
          className={`w-[10px] text-black-AAA transition-transform duration-200 ${isClick ? "" : "rotate-180"}`}
        />
      </CommonButton>
      {isClick && (
        <ul
          className={`absolute left-0 w-full z-10 bg-white ${isMobile ? "bottom-[44px] text-black-777 text-[18px]" : "top-[39px] text-black-999 text-[13px] text-center"} divide-y divide-black-AAA divide-dashed rounded-[5px] border border-black-AAA`}
          onClick={handleClickOption}
        >
          {langData.map((item, i) => (
            <li key={`lang-select-${i}`}>
              <CommonButton
                name={item.id}
                className={`${isMobile ? "h-[40px]" : "h-[34px]"} w-full`}
              >
                {item.title}
              </CommonButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
