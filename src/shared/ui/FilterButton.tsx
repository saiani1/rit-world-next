import { useState } from "react";
import FilterIcon from "public/assets/svg/filter-icon.svg";
import { FilterDialog } from "./FilterDialog";

export const FilterButton = () => {
  const [isClick, setIsClick] = useState(false);
  const handleClick = () => {
    setIsClick((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="필터 아이콘"
        className="flex justify-center items-center w-[25px] h-[25px]"
        onClick={handleClick}
      >
        <FilterIcon />
      </button>
      {isClick && <FilterDialog />}
    </div>
  );
};
