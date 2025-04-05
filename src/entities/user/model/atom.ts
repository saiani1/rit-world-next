import { atomWithStorage } from "jotai/utils";

export const loginAtom = atomWithStorage<boolean>("login", false);
