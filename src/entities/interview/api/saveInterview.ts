import { supabase } from "shared/index";
import { AnalysisResultType } from "../model";

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
