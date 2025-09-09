import { supabase } from "shared/index";
import { upsertHashtag } from "./upsertHashtag";
import { postBlogHashtag } from "./postBlogHashtag";
import { PostBlogType } from "../model";

type postBlogApiType = {
  data: PostBlogType;
  hashtags: string[];
};

export const postBlog = async ({ data, hashtags }: postBlogApiType) => {
  try {
    // blog테이블에 post요청
    const { data: blog, error: blogError } = await supabase
      .from("blog")
      .insert([data])
      .select()
      .single();

    if (blogError || !blog) return false;

    // 해시태그 upsert
    const hashtagArr = await upsertHashtag({ hashtags });
    if (!hashtagArr) return false;

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtag(blogHashtagData);
    if (!isPostBlogHashtag) return false;

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    return false;
  }
};
