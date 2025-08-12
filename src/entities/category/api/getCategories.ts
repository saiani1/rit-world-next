"use server";
import { createClient } from "shared/api/server";

export const getCategories = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("category").select("*");

    if (error || !data) {
      throw new Error("Failed to fetch categories");
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};
