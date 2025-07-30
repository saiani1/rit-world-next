"use server";
import { createClient } from "shared/api/server";

export const getBlogList = async () => {
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
    .order("create_at", { ascending: false });
  if (error) {
    console.log(error);
    return [];
  }

  return blog;
};
