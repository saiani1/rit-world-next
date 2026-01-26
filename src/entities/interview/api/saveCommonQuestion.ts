import { supabase } from "shared/index";
import { CommonQuestionType, UpsertCommonQuestionInput } from "../model";

type SaveCommonQuestionParams = {
  datas: UpsertCommonQuestionInput;
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
