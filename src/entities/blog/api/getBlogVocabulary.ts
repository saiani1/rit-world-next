import { supabase } from "shared/index";
import { BlogVocabularyType } from "../model";

export const getBlogVocabulary = async (
  blog_id: string
): Promise<BlogVocabularyType[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_vocabularies")
      .select(
        `
        id,
        blog_id,
        vocabulary_id,
        created_at,
        vocabularies:vocabulary_id (
          id,
          word,
          reading,
          meaning,
          category_id,
          created_at
        )
      `
      )
      .eq("blog_id", blog_id);

    if (error) {
      console.error("getBlogVocabulary failed:", error);
      return [];
    }

    return (data || []) as unknown as BlogVocabularyType[];
  } catch (e) {
    console.error("getBlogVocabulary exception:", e);
    return [];
  }
};
