"use client";
import { useState } from "react";

import FilterIcon from "public/assets/svg/filter-icon.svg";
import { FilterDialog } from "./FilterDialog";
import { CommonButton } from "shared/ui";

export const FilterButton = () => {
  const [isClick, setIsClick] = useState(false);
  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  return (
    <div className="relative">
      <CommonButton
        aria-label="필터 아이콘"
        className="flex justify-center items-center w-[25px] h-[25px]"
        onClick={handleClick}
      >
        <FilterIcon />
      </CommonButton>
      {isClick && <FilterDialog />}
    </div>
  );
};
