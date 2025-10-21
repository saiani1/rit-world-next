"use server";
import { createClient } from "shared/api/server";

export const getBlogByPathJp = async (path: string) => {
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
      .eq("blog.path", path)
      .single();

    if (error) {
      console.log(error);
      return null;
    }

    const transformed = {
      id: blog.id,
      subject: blog.subject,
      summary: blog.summary,
      content: blog.content,
      blog_id: blog.blog_id,
      locale: blog.locale,
      create_at: blog.create_at,

      path: blog.blog.path,
      thumbnail: blog.blog.thumbnail,
      category_large: blog.blog.category_large,
      category_middle: blog.blog.category_middle,
      middle_category_id: blog.blog.middle_category_id,
      large_category_id: blog.blog.large_category_id,
      blog_hashtag: blog.blog_translation_hashtag,
    };

    return transformed;
  } catch (err) {
    console.error(err);
    return null;
  }
};
