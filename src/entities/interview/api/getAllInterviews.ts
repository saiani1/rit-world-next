import { supabase } from "shared/index";
import { AnalysisResultType } from "../model";

export const getAllInterviews = async () => {
  const { data, error } = await supabase
    .from("interviews")
    .select("interview_type, qa_data");

  if (error) {
    throw new Error(error.message);
  }

  return data as Pick<AnalysisResultType, "interview_type" | "qa_data">[] | [];
};
