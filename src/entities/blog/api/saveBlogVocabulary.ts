import { supabase } from "shared/index";
import { VocabularyType } from "../model";

type SaveBlogVocabularyParams = {
  blog_id: string;
  category_id: string | null;
  vocabList: Omit<VocabularyType, "id" | "created_at">[];
};

export const saveBlogVocabulary = async ({
  blog_id,
  category_id,
  vocabList,
}: SaveBlogVocabularyParams) => {
  try {
    if (!vocabList || vocabList.length === 0) {
      // 어휘 목록이 비어있다면 기존 매핑만 삭제 처리
      await supabase.from("blog_vocabularies").delete().eq("blog_id", blog_id);
      return true;
    }

    // 1. 마스터 어휘 테이블에 upsert (중복 단어는 기존 데이터 유지/업데이트)
    const { data: upsertedVocabs, error: vocabError } = await supabase
      .from("vocabularies")
      .upsert(
        vocabList.map((v) => ({
          word: v.word,
          reading: v.reading,
          meaning: v.meaning,
          category_id,
        })),
        { onConflict: "word" }
      )
      .select();

    if (vocabError || !upsertedVocabs) {
      console.error("Vocabulary upsert failed:", vocabError);
      return false;
    }

    // 2. 해당 블로그에 묶여있던 기존 어휘 매핑 관계 제거
    const { error: deleteError } = await supabase
      .from("blog_vocabularies")
      .delete()
      .eq("blog_id", blog_id);

    if (deleteError) {
      console.error("Vocabulary mapping delete failed:", deleteError);
      return false;
    }

    // 3. 새로운 매핑 관계 등록
    const mappingData = upsertedVocabs.map((vocab) => ({
      blog_id,
      vocabulary_id: vocab.id,
    }));

    const { error: mappingError } = await supabase
      .from("blog_vocabularies")
      .insert(mappingData);

    if (mappingError) {
      console.error("Vocabulary mapping insert failed:", mappingError);
      return false;
    }

    return true;
  } catch (e) {
    console.error("saveBlogVocabulary failed:", e);
    return false;
  }
};
