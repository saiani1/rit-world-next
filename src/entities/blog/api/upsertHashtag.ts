import { supabase } from "shared/index";

type upsertHashtagType = {
  hashtags: string[];
};

export const upsertHashtag = async ({ hashtags }: upsertHashtagType) => {
  try {
    const { data: hashtagsData, error: hashtagError } = await supabase
      .from("hashtag")
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
