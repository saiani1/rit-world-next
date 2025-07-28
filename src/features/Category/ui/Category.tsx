"use client";
import { CategoryType } from "entities/category";

type CategoryComType = {
  data: CategoryType[];
};

export const Category = ({ data }: CategoryComType) => {
  return (
    <nav className="relative flex flex-col grow mt-[10px] py-[20px] px-[32px] w-[250px] bg-white rounded-xl">
      <p className="pb-[4px] mb-[20px] text-[#888] font-medium text-[12px] border-b">
        CATEGORY
      </p>
      <div className="flex flex-col justify-between h-full"></div>
    </nav>
  );
};
