"use server";
import { createClient } from "shared/api/server";
import { AnalysisResultType } from "../model";

export const getAllInterviews = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviews")
    .select("interview_type, qa_data");

  if (error) {
    throw new Error(error.message);
  }

  return data as Pick<AnalysisResultType, "interview_type" | "qa_data">[] | [];
};
