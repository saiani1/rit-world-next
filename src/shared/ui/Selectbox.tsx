"use client";
import { useRef, useState } from "react";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { useOnClickOutside } from "shared/hooks/useOnClickOutside";
import { CommonButton } from "./CommonButton";

type SelectboxType = {
  data: string[];
  placeholder: string;
  selectOption: string;
  setSelectOption: React.Dispatch<React.SetStateAction<string>>;
};

export const Selectbox = ({
  data,
  placeholder,
  selectOption,
  setSelectOption,
}: SelectboxType) => {
  const selectRef = useRef(null);
  const [isClick, setIsClick] = useState(false);

  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  const handleClickOption = (e: React.MouseEvent<HTMLUListElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    if (name !== undefined) {
      setSelectOption(name);
      setIsClick(false);
    }
  };

  useOnClickOutside(selectRef, () => setIsClick(false));

  return (
    <div className="relative inline-block shrink-0" ref={selectRef}>
      <CommonButton
        className="flex items-center gap-x-[20px] px-[20px] h-[34px] text-black-999 text-[13px] font-regular bg-black-F5 rounded-[5px]"
        onClick={handleClick}
      >
        {selectOption.length !== 0 ? selectOption : placeholder}
        <ArrowIcon className="rotate-180" />
      </CommonButton>
      {isClick && (
        <ul
          className="absolute top-[39px] left-0 text-center w-full z-10 bg-black-F5 text-black-999 text-[13px] font-medium divide-y divide-black-FFF rounded-[5px]"
          onClick={handleClickOption}
        >
          {data.map((item, i) => (
            <li key={`select-${i}`}>
              <CommonButton name={item} className="h-[34px] w-full">
                {item}
              </CommonButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
