"use server";
import { createClient } from "shared/api/server";
import { InterviewType } from "../model/type";

export const getInterviewById = async (id: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as InterviewType;
};
