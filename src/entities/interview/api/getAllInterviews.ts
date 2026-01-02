import { supabase } from "shared/index";

export const getAllInterviews = async () => {
  const { data, error } = await supabase
    .from("interviews")
    .select("interview_type, qa_data");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
