import { supabase } from "shared/index";

export const saveInterviewPattern = async (
  totalInterviews: number,
  analysisResult: any
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
