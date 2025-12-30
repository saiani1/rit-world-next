import { supabase } from "shared/index";
import { InterviewType } from "../model/type";

export const getInterviewById = async (id: string) => {
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as InterviewType;
};
