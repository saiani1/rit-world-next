import FilterIcon from "public/assets/svg/filter-icon.svg";

export const FilterButton = () => {
  const handleClick = () => {};

  return (
    <button
      type="button"
      aria-label="필터 아이콘"
      className="flex justify-center items-center w-[25px] h-[25px]"
      onClick={handleClick}
    >
      <FilterIcon />
    </button>
  );
};
