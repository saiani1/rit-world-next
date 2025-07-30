import { BlogType } from "features/Blog";
import { supabase } from "shared/index";

type postBlogType = {
  data: BlogType;
  hashtags: string[];
};

export const postBlog = async ({ data, hashtags }: postBlogType) => {
  try {
    // blog테이블에 post요청
    const { data: blog, error: blogError } = await supabase
      .from("blog")
      .insert([data])
      .select()
      .single();

    if (blogError || !blog) return false;

    // 해시태그 upsert
    const { data: hashtagsData, error: hashtagError } = await supabase
      .from("hashtag")
      .upsert(
        hashtags.map((name) => ({ name })),
        { onConflict: "name" }
      )
      .select(); // => id 포함된 hashtag rows

    if (hashtagError || !hashtagsData) return false;

    // blog_hashtag저장
    const blogHashtagData = hashtagsData?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));

    const { error: blogHashtagError } = await supabase
      .from("blog_hashtag")
      .insert(blogHashtagData);

    if (blogHashtagError) return false;

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    return false;
  }
};
