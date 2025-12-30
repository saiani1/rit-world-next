"use server";
import { createClient } from "shared/api/server";
import { InterviewListType } from "../model/type";

export const getInterviewList = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviews")
    .select(
      "id, company_name, interview_type, recorded_at, interview_date, duration"
    )
    .order("interview_date", { ascending: false });

  if (error) throw error;

  return data as InterviewListType;
};
