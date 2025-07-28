"use client";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";

import {
  BlogOption,
  BlogPostPayloadType,
  hashtagListAtom,
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
  ThumbnailWithTitle,
} from "features/Blog";
import { CategoryType } from "entities/category";
import { CommonButton, CommonInput, CustomEditor, Title } from "shared/ui";
import { supabase } from "shared/index";

type CreateBlogScreenType = {
  categories: CategoryType[];
};

const CreateBlogScreen = ({ categories }: CreateBlogScreenType) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const selectedLargeCategory = useAtomValue(selectedLargeCategoryAtom);
  const selectedMiddleCategory = useAtomValue(selectedMiddleCategoryAtom);
  const hashtags = useAtomValue(hashtagListAtom);

  const { getValues, setValue, register, control, handleSubmit } =
    useForm<BlogPostPayloadType>();

  const handleChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const onSubmit = async (data: BlogPostPayloadType) => {
    if (
      !selectedLargeCategory ||
      !selectedMiddleCategory ||
      !imageFile ||
      !data.path
    )
      return;

    setValue("large_category_id", selectedLargeCategory?.id);
    setValue("middle_category_id", selectedMiddleCategory?.id);

    // supabase storage에 이미지 업로드
    const {} = await supabase.storage
      .from("blog")
      .upload(`blog-thumbnail/${data.path}`, imageFile);
    // 업로드 된 이미지 url반환
    const publicUrl = supabase.storage
      .from("blog")
      .getPublicUrl(`blog-thumbnail/${data.path}`).data.publicUrl;

    setValue("thumbnail", publicUrl);

    // blog테이블에 post요청
    const { data: blog, error } = await supabase
      .from("blog")
      .insert([getValues()])
      .select()
      .single(); // id받아오기

    // 해시태그 upsert
    const { data: hashtagsData } = await supabase
      .from("hashtag")
      .upsert(
        hashtags.map((name) => ({ name })),
        { onConflict: "name" }
      )
      .select(); // => id 포함된 hashtag rows

    // blog_hashtag저장
    const blogHashtagData = hashtagsData?.map((hashtag) => ({
      blog_id: blog.id,
      hashtag_id: hashtag.id,
    }));

    await supabase.from("blog_hashtag").insert(blogHashtagData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="포스트 작성" />
        <div className="flex gap-x-[5px]">
          <CommonButton className="px-3 py-1 text-[14px] text-white bg-black-AAA rounded-md">
            취소
          </CommonButton>
          <CommonButton
            type="submit"
            className="px-3 py-1 text-[14px] text-white bg-purple-100 rounded-md"
          >
            발행
          </CommonButton>
        </div>
      </div>
      <ThumbnailWithTitle
        previewUrl={previewUrl}
        handleChange={handleChangeFileInput}
        {...register("subject")}
      />
      <BlogOption categories={categories} />
      <div className="flex flex-col gap-y-2 mb-[20px]">
        <CommonInput
          className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
          placeholder="요약글을 입력하세요."
          {...register("summary")}
        />
        <CommonInput
          className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
          placeholder="path를 입력하세요."
          {...register("path")}
        />
      </div>
      <CustomEditor control={control} name="content" />
    </form>
  );
};

export default CreateBlogScreen;
