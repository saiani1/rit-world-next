"use server";
import { createClient } from "shared/api/server";
import { InterviewSetType } from "../model";

export const getInterviewSets = async ({
  id,
  companyId,
}: {
  id?: string;
  companyId?: string;
}): Promise<InterviewSetType[]> => {
  const supabase = createClient();

  let query = supabase
    .from("interview_sets")
    .select("*")
    .order("created_at", { ascending: false });

  if (id) {
    query = query.eq("id", id);
  }

  if (companyId) {
    query = query.eq("company_id", companyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching interview sets:", error);
    throw error;
  }
  return data;
};
