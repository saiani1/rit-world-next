"use server";
import { createClient } from "shared/api/server";
import { InterviewListType } from "../model/type";

export const getInterviewList = async (id?: string) => {
  const supabase = createClient();

  let query = supabase
    .from("interviews")
    .select(
      "id, company_name, company_type, interview_type, recorded_at, interview_date, duration, company_id"
    );

  if (id) {
    query = query.eq("company_id", id);
  }

  const { data, error } = await query.order("interview_date", {
    ascending: false,
  });

  if (error) throw error;

  return data as InterviewListType;
};
