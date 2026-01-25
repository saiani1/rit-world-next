import { supabase } from "shared/index";
import { InterviewSetType } from "../model";

type SaveInterviewSetParams = {
  datas: InterviewSetType;
};

export const saveInterviewSet = async ({
  datas,
}: SaveInterviewSetParams): Promise<InterviewSetType> => {
  const { data, error } = await supabase
    .from("interview_sets")
    .insert({
      ...datas,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
