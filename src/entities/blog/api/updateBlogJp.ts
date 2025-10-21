import { supabase } from "shared/index";
import { upsertHashtagJp } from "./upsertHashtagJp";
import { postBlogHashtagJp } from "./postBlogHashtagJp";
import { BlogJpType } from "../model";

type updateBlogJpType = {
  data: BlogJpType;
  hashtags: string[];
};

export const updateBlogJp = async ({ data, hashtags }: updateBlogJpType) => {
  try {
    // blog_translation테이블에 post요청
    const { error: blogError } = await supabase
      .from("blog_translation")
      .update({
        subject: data.subject,
        summary: data.summary,
        content: data.content,
        is_private: data.is_private,
      })
      .eq("id", data.id);

    if (blogError) return false;

    // 해당 blog에 연결되어있던 기존 hashtag 삭제
    await supabase
      .from("blog_translation_hashtag")
      .delete()
      .eq("blog_id", data.id);

    // 해시태그 upsert
    const hashtagArr = await upsertHashtagJp({ hashtags });
    if (!hashtagArr) return false;

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: data.id!,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtagJp(blogHashtagData);
    if (!isPostBlogHashtag) return false;

    return true;
  } catch (e) {
    console.error("updateBlog failed:", e);
    return false;
  }
};
