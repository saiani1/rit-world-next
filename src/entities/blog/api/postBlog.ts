import { supabase } from "shared/index";
import { upsertHashtag } from "./upsertHashtag";
import { postBlogHashtag } from "./postBlogHashtag";
import { PostBlogType, VocabularyType } from "../model";
import { saveBlogVocabulary } from "./saveBlogVocabulary";

type postBlogApiType = {
  data: PostBlogType;
  hashtags: string[];
  vocabList?: Omit<VocabularyType, "id" | "created_at">[];
};

export const postBlog = async ({
  data,
  hashtags,
  vocabList,
}: postBlogApiType) => {
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

    // 일본어 어휘 저장
    if (vocabList) {
      const isSavedVocab = await saveBlogVocabulary({
        blog_id: blog.id,
        category_id: data.large_category_id || null,
        vocabList,
      });
      if (!isSavedVocab) return false;
    }

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    return false;
  }
};
