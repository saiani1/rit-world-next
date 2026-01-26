"use server";
import { createClient } from "shared/api/server";
import { QnAItemType } from "../model";

export const getQnAItems = async (setId?: string): Promise<QnAItemType[]> => {
  const supabase = createClient();
  let query = supabase.from("qna_items").select("*");

  if (setId) {
    query = query.eq("set_id", setId);
  }

  const { data, error } = await query
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching Q&A items:", error);
    throw error;
  }
  return data;
};
