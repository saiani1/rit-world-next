import { atom } from "jotai";
import { CommonQuestionType } from "./type";

export const selectedQuestionsAtom = atom<CommonQuestionType[]>([]);
