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
    const { data, error } = await supabase.rpc("save_blog_vocabulary", {
      p_blog_id: blog_id,
      p_category_id: category_id,
      p_vocab_list: vocabList,
    });

    if (error) {
      console.error("RPC save_blog_vocabulary failed:", error);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error("saveBlogVocabulary failed:", e);
    return false;
  }
};
