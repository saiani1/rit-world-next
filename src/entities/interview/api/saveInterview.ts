import { supabase } from "shared/index";
import { AnalysisResultType } from "../model";

export const saveInterview = async (
  rawText: string,
  data?: Partial<AnalysisResultType>
) => {
  const { error } = await supabase.from("interviews").insert({
    ...data,
    raw_text: rawText,
    status: "pending",
  });

  if (error) throw error;
};
