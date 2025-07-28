import { CategoryType } from "entities/category";
import { atom } from "jotai";

export const selectedLargeCategoryAtom = atom<CategoryType>();
export const selectedMiddleCategoryAtom = atom<CategoryType>();
export const hashtagListAtom = atom<string[]>([]);
