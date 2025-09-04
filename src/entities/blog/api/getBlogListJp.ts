"use server";
import { createClient } from "shared/api/server";

export const getBlogListJp = async () => {
  try {
    const supabase = await createClient();
    const { data: blog, error } = await supabase
      .from("blog_translation")
      .select(
        `
        *,
        blog:blog_id (
          path,
          thumbnail,
          category_large:category!fk_large_category(title),
          category_middle:category!fk_middle_category(title)
        ),
        blog_hashtag (
          hashtag_id:hashtag_id (
            hashtag_translation!fk_hashtag_translation (
              name,
              locale
            )
          )
        )
      `
      )
      .order("create_at", { ascending: false });

    if (error) {
      console.log(error);
      return [];
    }

    return blog;
  } catch (err) {
    console.error(err);
  }
};
