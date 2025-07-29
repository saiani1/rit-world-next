import { atomWithReset } from "jotai/utils";

import { CategoryType } from "entities/category";

export const selectedLargeCategoryAtom = atomWithReset<
  CategoryType | undefined
>(undefined);
export const selectedMiddleCategoryAtom = atomWithReset<
  CategoryType | undefined
>(undefined);
export const hashtagListAtom = atomWithReset<string[] | []>([]);
