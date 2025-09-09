"use client";
import { useRef, useState } from "react";
import { SetStateAction } from "jotai";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { CategoryType } from "entities/category";
import { useOnClickOutside } from "shared/hooks/useOnClickOutside";
import { CommonButton } from "./CommonButton";

type SelectboxType = {
  data: CategoryType[];
  placeholder: string;
  selectOption?: CategoryType;
  setSelectOption: (value: SetStateAction<CategoryType | undefined>) => void;
  disabled?: boolean;
};

export const Selectbox = ({
  data,
  placeholder,
  selectOption,
  setSelectOption,
  disabled,
}: SelectboxType) => {
  const selectRef = useRef(null);
  const [isClick, setIsClick] = useState(false);

  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  const handleClickOption = (e: React.MouseEvent<HTMLUListElement>) => {
    const title = (e.target as HTMLElement).dataset.title;
    if (title) {
      const parsedData = JSON.parse(title);
      setSelectOption(parsedData);
      setIsClick(false);
    }
  };

  useOnClickOutside(selectRef, () => setIsClick(false));

  return (
    <div className="relative inline-block shrink-0" ref={selectRef}>
      <CommonButton
        className={`flex items-center gap-x-[20px] px-[20px] h-[34px] ${disabled ? "text-black-BBB bg-black-DDD cursor-not-allowed" : "text-black-999 bg-black-F5"} text-[13px] font-regular rounded-[5px]`}
        onClick={handleClick}
        disabled={disabled}
      >
        {selectOption ? selectOption.title : placeholder}
        <ArrowIcon
          className={`transition-transform duration-200 ${isClick ? "" : "rotate-180"}`}
        />
      </CommonButton>
      {isClick && (
        <ul
          className="absolute top-[39px] left-0 text-center w-full z-10 bg-black-F5 text-black-999 text-[13px] font-medium divide-y divide-black-FFF rounded-[5px]"
          onClick={handleClickOption}
        >
          {data.map((item, i) => (
            <li key={`select-${i}`}>
              <CommonButton
                data-title={JSON.stringify(item)}
                className="h-[34px] w-full"
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
