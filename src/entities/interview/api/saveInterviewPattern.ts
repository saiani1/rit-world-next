import { supabase } from "shared/index";
import { PatternAnalysisResultType } from "../model";

export const saveInterviewPattern = async (
  totalInterviews: number,
  analysisResult: Pick<PatternAnalysisResultType, "analysis_result">
) => {
  const { data, error } = await supabase
    .from("interview_patterns")
    .insert([
      {
        total_interviews: totalInterviews,
        analysis_result: analysisResult,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
