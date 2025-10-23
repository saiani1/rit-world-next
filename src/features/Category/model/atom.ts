import { atom } from "jotai";

import { CategoryType } from "entities/category";

export const CategoryListAtom = atom<CategoryType[]>([]);
export const isClickMobileMenuAtom = atom<boolean>(false);
