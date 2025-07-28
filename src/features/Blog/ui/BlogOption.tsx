"use client";
import { useAtom } from "jotai";

import { CategoryType } from "entities/category";
import { Selectbox } from "shared/ui";
import { HashtagList } from "./HashtagList";
import {
  hashtagListAtom,
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
} from "../model";

type BlogOptionType = {
  categories: CategoryType[];
};

export const BlogOption = ({ categories }: BlogOptionType) => {
  const [selectedLargeCategory, setSelectedLargeCategory] = useAtom(
    selectedLargeCategoryAtom
  );
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useAtom(
    selectedMiddleCategoryAtom
  );
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);

  const filteredLargeCategoryArr = categories.filter(
    (item) => item.parent_id === null
  );

  const filteredMiddleCategoryArr = categories.filter(
    (item) => item.parent_id === selectedLargeCategory?.id
  );

  return (
    <div className="flex gap-x-2 mb-[20px]">
      <Selectbox
        data={filteredLargeCategoryArr}
        selectOption={selectedLargeCategory}
        setSelectOption={setSelectedLargeCategory}
        placeholder="카테고리 대분류"
      />
      <Selectbox
        data={filteredMiddleCategoryArr}
        selectOption={selectedMiddleCategory}
        setSelectOption={setSelectedMiddleCategory}
        placeholder="카테고리 중분류"
        disabled={!selectedLargeCategory?.id}
      />
      <HashtagList hashtags={hashtags} setHashtags={setHashtags} />
    </div>
  );
};
