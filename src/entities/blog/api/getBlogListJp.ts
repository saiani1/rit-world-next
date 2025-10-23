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
          large_category_id,
          middle_category_id,
          category_large:category!fk_large_category(title),
          category_middle:category!fk_middle_category(title)
        ),
        blog_translation_hashtag (
          hashtag_id (
            id,
            name
          )
        )
        `
      )
      .order("create_at", { ascending: false });

    if (error) {
      console.log(error);
      return [];
    }

    const transformData = blog.map((item) => ({
      id: item.id,
      subject: item.subject,
      summary: item.summary,
      content: item.content,
      blog_id: item.blog_id,
      locale: item.locale,
      create_at: item.create_at,
      is_private: item.is_private,

      path: item.blog.path,
      thumbnail: item.blog.thumbnail,
      category_large: item.blog.category_large,
      category_middle: item.blog.category_middle,
      middle_category_id: item.blog.middle_category_id,
      large_category_id: item.blog.large_category_id,
      blog_hashtag: item.blog_translation_hashtag,
    }));

    return transformData;
  } catch (err) {
    console.error(err);
  }
};
