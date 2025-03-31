"use client";
import { useRef, useState } from "react";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { useOnClickOutside } from "shared/hooks/useOnClickOutside";

type SelectboxType = {
  data?: [];
  placeholder: string;
};

export const Selectbox = ({ data, placeholder }: SelectboxType) => {
  const selectRef = useRef(null);
  const [isClick, setIsClick] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);

  const tmpArr = ["러바오", "아이바오", "푸바오", "루이바오", "후이바오"];

  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  const handleClickOption = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    if (name !== undefined) {
      setSelectedOption(name);
      setIsClick(false);
    }
  };

  useOnClickOutside(selectRef, () => setIsClick(false));

  return (
    <div className="relative inline-block shrink-0" ref={selectRef}>
      <button
        type="button"
        className="flex items-center gap-x-[20px] px-[20px] h-[34px] text-black-999 text-[15px] font-medium bg-black-50 rounded-[5px]"
        onClick={handleClick}
      >
        <span>{selectedOption}</span>
        <ArrowIcon className="rotate-180" />
      </button>
      {isClick && (
        <ul
          className="absolute top-[39px] left-0 text-center w-full z-10 bg-black-50 text-black-999 text-[15px] font-medium divide-y divide-black-FFF rounded-[5px]"
          onClick={handleClickOption}
        >
          {tmpArr.map((item, i) => (
            <li key={`select-${i}`}>
              <button type="button" name={item} className="h-[34px] w-full">
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
