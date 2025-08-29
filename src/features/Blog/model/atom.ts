import { atomWithReset, atomWithStorage } from "jotai/utils";

import { CategoryType } from "entities/category";
import { BlogType } from "./type";

export const selectedLargeCategoryAtom = atomWithReset<
  CategoryType | undefined
>(undefined);
export const selectedMiddleCategoryAtom = atomWithReset<
  CategoryType | undefined
>(undefined);
export const hashtagListAtom = atomWithReset<string[]>([]);
export const blogListAtom = atomWithStorage<BlogType[] | []>("blogList", []);
