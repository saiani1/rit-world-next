import { supabase } from "shared/index";

export const postBlogHashtagJp = async (
  data: {
    blog_id: string;
    hashtag_id: string;
  }[]
) => {
  try {
    const { error: blogHashtagError } = await supabase
      .from("blog_translation_hashtag")
      .insert(data);
    if (blogHashtagError) return false;
    return true;
  } catch (err) {
    console.error(err);
  }
};
