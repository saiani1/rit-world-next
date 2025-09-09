import { supabase } from "shared/index";

type upsertHashtagJpType = {
  hashtags: string[];
};

export const upsertHashtagJp = async ({ hashtags }: upsertHashtagJpType) => {
  try {
    const { data: hashtagsData, error: hashtagError } = await supabase
      .from("hashtag_translation")
      .upsert(
        hashtags.map((name) => ({ name })),
        { onConflict: "name" }
      )
      .select();

    if (hashtagError || !hashtagsData) return false;
    return hashtagsData;
  } catch (err) {
    console.error(err);
  }
};
