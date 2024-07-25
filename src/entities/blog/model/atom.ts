import { atom } from "jotai";

export const filterAtom = atom<"all" | "new">("all");
