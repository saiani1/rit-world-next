import { supabase } from "shared/index";
import { upsertHashtag } from "./upsertHashtag";
import { postBlogHashtag } from "./postBlogHashtag";
import { PostBlogType } from "../model";

type updateBlogType = {
  data: PostBlogType;
  hashtags: string[];
};

export const updateBlog = async ({ data, hashtags }: updateBlogType) => {
  try {
    // blog테이블에 post요청
    const { error: blogError } = await supabase
      .from("blog")
      .update({
        subject: data.subject,
        summary: data.summary,
        content: data.content,
        thumbnail: data.thumbnail,
        large_category_id: data.large_category_id,
        middle_category_id: data.middle_category_id,
      })
      .eq("id", data.id);

    if (blogError) return false;

    // 해당 blog에 연결되어있던 기존 hashtag 삭제
    await supabase.from("blog_hashtag").delete().eq("blog_id", data.id);

    // 해시태그 upsert
    const hashtagArr = await upsertHashtag({ hashtags });
    if (!hashtagArr) return false;

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: data.id!,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtag(blogHashtagData);
    if (!isPostBlogHashtag) return false;

    return true;
  } catch (e) {
    console.error("updateBlog failed:", e);
    return false;
  }
};
