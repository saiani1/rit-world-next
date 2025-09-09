import { supabase } from "shared/index";

type deleteBlogJpType = {
  blog_id: string;
};

export const deleteBlogJp = async ({
  blog_id,
}: deleteBlogJpType): Promise<boolean> => {
  try {
    // blog_translation_hashtag제거
    const { error: hashtagError } = await supabase
      .from("blog_translation_hashtag")
      .delete()
      .eq("blog_id", blog_id);
    if (hashtagError) {
      console.error("hashtagError", hashtagError);
      return false;
    }
    // console.log("blog_translation_hashtag제거 완료");

    // blog_translation테이블의 row제거
    const { error: blogError } = await supabase
      .from("blog_translation")
      .delete()
      .eq("id", blog_id);
    if (blogError) {
      console.error("blogError", blogError);
      return false;
    }
    // console.log("blog_translation테이블의 row제거 완료");

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
