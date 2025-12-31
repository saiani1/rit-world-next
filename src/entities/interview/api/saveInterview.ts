import { AnalysisResultType } from "../model";
import { supabase } from "shared/index";

export const saveInterview = async (
  data: AnalysisResultType,
  rawText: string
) => {
  const { error } = await supabase.from("interviews").insert({
    ...data,
    raw_text: rawText,
  });

  if (error) throw error;
};
