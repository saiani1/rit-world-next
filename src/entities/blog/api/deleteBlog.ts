import { supabase } from "shared/index";

type deleteBlogType = {
  blog_id: string;
  path: string;
};

export const deleteBlog = async ({ blog_id, path }: deleteBlogType) => {
  try {
    // blog_hashtag제거
    const { error: hashtagError } = await supabase
      .from("blog_hashtag")
      .delete()
      .eq("blog_id", blog_id);
    if (hashtagError) {
      console.log("hashtagError", hashtagError);
      return false;
    }
    console.log("blog_hashtag제거 완료");

    // storage의 blog-thumbnail삭제
    const { error: thumbnailError } = await supabase.storage
      .from("blog")
      .remove([`blog-thumbnail/${path}`]);

    if (thumbnailError) {
      console.log("thumbnailError", thumbnailError);
      return false;
    }
    console.log("storage의 blog-thumbnail삭제 완료");

    // storagedml content-images폴더 내부 데이터 가져오기
    const { data: files, error: listError } = await supabase.storage
      .from("blog") // bucket
      .list(`content-images/${path}`);

    if (listError) {
      console.log("listError", listError);
      return false;
    }
    console.log("storagedml content-images폴더 내부 데이터 가져오기 완료");

    // 파일 경로 배열로 만들기
    const filePaths =
      files?.map((file) => `content-images/${path}/${file.name}`) || [];

    // 폴더 내부 이미지 파일 제거
    if (filePaths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from("blog")
        .remove(filePaths);

      if (removeError) {
        console.log("removeError", removeError);
        return false;
      }
    }
    console.log("폴더 내부 이미지 파일 제거 완료");

    // blog테이블의 row제거
    const { error: blogError } = await supabase
      .from("blog")
      .delete()
      .eq("id", blog_id);
    if (blogError) {
      console.log("blogError", blogError);
      return false;
    }
    console.log("blog테이블의 row제거 완료");

    return true;
  } catch (err) {
    console.error(err);
  }
};
