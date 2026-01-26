import { supabase } from "shared/index";
import { InterviewSetType, UpsertInterviewSetInput } from "../model";

type SaveInterviewSetParams = {
  datas: UpsertInterviewSetInput;
};

export const saveInterviewSet = async ({
  datas,
}: SaveInterviewSetParams): Promise<InterviewSetType> => {
  const { data, error } = await supabase
    .from("interview_sets")
    .upsert({
      ...datas,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};
