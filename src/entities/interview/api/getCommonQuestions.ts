"use server";
import { createClient } from "shared/api/server";
import { CommonQuestionType } from "../model";

export const getCommonQuestions = async (): Promise<CommonQuestionType[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("common_questions")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching common questions:", error);
    throw error;
  }
  return data;
};
