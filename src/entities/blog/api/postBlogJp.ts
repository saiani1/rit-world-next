import { supabase } from "shared/index";
import { PostBlogJpType, VocabularyType } from "../model";
import { upsertHashtagJp } from "./upsertHashtagJp";
import { postBlogHashtagJp } from "./postBlogHashtagJp";
import { saveBlogVocabulary } from "./saveBlogVocabulary";

type postBlogJpType = {
  data: PostBlogJpType;
  hashtags: string[];
  vocabList?: Omit<VocabularyType, "id" | "created_at">[];
  categoryId?: string | null;
};

export const postBlogJp = async ({
  data,
  hashtags,
  vocabList,
  categoryId,
}: postBlogJpType) => {
  let createdBlogTranslationId: string | null = null;
  try {
    const insertData = {
      blog_id: data.blog_id,
      subject: data.subject,
      summary: data.summary,
      content: data.content,
      locale: data.locale,
      is_private: data.is_private,
    };

    // blog_translation테이블에 post요청
    const { data: blog, error: blogError } = await supabase
      .from("blog_translation")
      .insert([insertData])
      .select()
      .single();

    if (blogError || !blog) return false;
    createdBlogTranslationId = blog.id;

    // 해시태그 upsert
    const hashtagArr = await upsertHashtagJp({ hashtags });
    if (!hashtagArr) throw new Error("upsertHashtagJp failed");

    // blog_hashtag저장
    const blogHashtagData = hashtagArr?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));
    const isPostBlogHashtag = await postBlogHashtagJp(blogHashtagData);
    if (!isPostBlogHashtag) throw new Error("postBlogHashtagJp failed");

    // 일본어 어휘 저장 복구
    if (vocabList && vocabList.length > 0) {
      const isSavedVocab = await saveBlogVocabulary({
        blog_id: data.blog_id,
        category_id: categoryId || null,
        vocabList,
      });
      if (!isSavedVocab) throw new Error("saveBlogVocabulary failed");
    }

    return true;
  } catch (e) {
    console.error("postBlog failed:", e);
    // 롤백 로직: 후속 저장 실패 시 생성된 일본어 번역본 레코드 삭제
    if (createdBlogTranslationId) {
      try {
        await supabase
          .from("blog_translation")
          .delete()
          .eq("id", createdBlogTranslationId);
      } catch (rollbackError) {
        console.error(
          "Rollback failed for blog_translation id:",
          createdBlogTranslationId,
          rollbackError
        );
      }
    }
    return false;
  }
};
