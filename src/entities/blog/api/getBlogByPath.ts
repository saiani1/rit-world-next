"use server";
import { createClient } from "shared/api/server";

export const getBlogByPath = async (path: string) => {
  try {
    const supabase = await createClient();
    const { data: blog, error } = await supabase
      .from("blog")
      .select(
        `
        *,
        blog_hashtag (
          hashtag_id (
            id,
            name
          )
        ),
        category_large:category!fk_large_category(title),
        category_middle:category!fk_middle_category(title)
        `
      )
      .eq("path", path)
      .single();
    if (error) {
      console.log(error);
      return null;
    }

    return blog;
  } catch (err) {
    console.error(err);
    return null;
  }
};
