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
  let createdBlogId: string | null = null;
  try {
    // blog테이블에 post요청
    const { data: blog, error: blogError } = await supabase
      .from("blog")
      .insert([data])
      .select()
      .single();

    if (blogError || !blog) return false;
    createdBlogId = blog.id;

    // 해시태그 upsert
    const hashtagArr = await upsertHashtag({ hashtags });
    if (!hashtagArr) throw new Error("upsertHashtag failed");

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtag(blogHashtagData);
    if (!isPostBlogHashtag) throw new Error("postBlogHashtag failed");

    // 일본어 어휘 저장
    if (vocabList && vocabList.length > 0) {
      const isSavedVocab = await saveBlogVocabulary({
        blog_id: blog.id,
        category_id: data.large_category_id || null,
        vocabList,
      });
      if (!isSavedVocab) throw new Error("saveBlogVocabulary failed");
    }

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    // 롤백 로직: 후속 저장 실패 시 생성된 블로그 레코드 삭제
    if (createdBlogId) {
      try {
        await supabase.from("blog").delete().eq("id", createdBlogId);
      } catch (rollbackError) {
        console.error(
          "Rollback failed for blog_id:",
          createdBlogId,
          rollbackError
        );
      }
    }
    return false;
  }
};
