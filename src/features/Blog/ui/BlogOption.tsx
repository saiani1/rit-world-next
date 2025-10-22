"use client";
import { useAtom } from "jotai";

import { CategoryType } from "entities/category";
import { Selectbox } from "shared/ui";
import { HashtagList } from "./HashtagList";
import {
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
} from "../model";

type BlogOptionType = {
  categories: CategoryType[];
  disabled?: boolean;
};

export const BlogOption = ({ categories, disabled }: BlogOptionType) => {
  const [selectedLargeCategory, setSelectedLargeCategory] = useAtom(
    selectedLargeCategoryAtom
  );
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useAtom(
    selectedMiddleCategoryAtom
  );

  const filteredLargeCategoryArr =
    categories && categories?.filter((item) => item.parent_id === null);

  const filteredMiddleCategoryArr =
    categories &&
    categories?.filter((item) => item.parent_id === selectedLargeCategory?.id);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2 mb-[10px]">
      {filteredLargeCategoryArr?.length !== 0 && (
        <Selectbox
          data={filteredLargeCategoryArr}
          selectOption={selectedLargeCategory}
          setSelectOption={setSelectedLargeCategory}
          placeholder="카테고리 대분류"
          disabled={disabled}
        />
      )}
      {filteredMiddleCategoryArr?.length !== 0 && (
        <Selectbox
          data={filteredMiddleCategoryArr}
          selectOption={selectedMiddleCategory}
          setSelectOption={setSelectedMiddleCategory}
          placeholder="카테고리 중분류"
          disabled={!selectedLargeCategory?.id || disabled}
        />
      )}
      <HashtagList />
    </div>
  );
};
