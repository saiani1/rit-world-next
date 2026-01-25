import { supabase } from "shared/index";
import { CommonQuestionType } from "../model";

type SaveCommonQuestionParams = {
  datas: Omit<CommonQuestionType, "id" | "created_at" | "updated_at"> & {
    id?: string;
  };
};

export const saveCommonQuestion = async ({
  datas,
}: SaveCommonQuestionParams): Promise<CommonQuestionType> => {
  const { data, error } = await supabase
    .from("common_questions")
    .upsert(datas)
    .select()
    .single();

  if (error) throw error;
  return data;
};
