"use server";
import { createClient } from "shared/api/server";
import { CategoryType } from "../model";

export const getCategories = async (): Promise<CategoryType[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("category").select("*");

  if (error || !data) {
    throw new Error("Failed to fetch categories");
  }
  return data;
};
