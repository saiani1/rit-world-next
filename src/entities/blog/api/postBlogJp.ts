import { supabase } from "shared/index";
import { PostBlogJpType } from "../model";
import { upsertHashtagJp } from "./upsertHashtagJp";
import { postBlogHashtagJp } from "./postBlogHashtagJp";

type postBlogJpType = {
  data: PostBlogJpType;
  hashtags: string[];
};

export const postBlogJp = async ({ data, hashtags }: postBlogJpType) => {
  try {
    const insertData = {
      blog_id: data.blog_id,
      subject: data.subject,
      summary: data.summary,
      content: data.content,
      locale: data.locale,
    };

    // blog_translation테이블에 post요청
    const { data: blog, error: blogError } = await supabase
      .from("blog_translation")
      .insert([insertData])
      .select()
      .single();

    if (blogError || !blog) return false;

    // 해시태그 upsert
    const hashtagArr = await upsertHashtagJp({ hashtags });
    if (!hashtagArr) return false;

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtagJp(blogHashtagData);
    if (!isPostBlogHashtag) return false;

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    return false;
  }
};
