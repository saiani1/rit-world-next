"use server";
import { createClient } from "shared/api/server";

export const getBlogList = async () => {
  const supabase = await createClient();
  const { data: blog, error } = await supabase.from("blog").select("*");
  if (error) {
    console.log(error);
    return [];
  }

  return blog;
};
