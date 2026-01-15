"use server";
import { createClient } from "shared/api/server";

export const getInterviewPattern = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interview_patterns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data || null;
};
