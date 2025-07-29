"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  BlogOption,
  BlogPostPayloadType,
  hashtagListAtom,
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
  ThumbnailWithTitle,
} from "features/Blog";
import { CategoryType } from "entities/category";
import { getThumbnailUrl, postBlog } from "entities/blog";
import { CommonButton, CommonInput, CustomEditor, Title } from "shared/ui";

type CreateBlogScreenType = {
  categories: CategoryType[];
};

const CreateBlogScreen = ({ categories }: CreateBlogScreenType) => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedLCate, setSelectedLCate] = useAtom(selectedLargeCategoryAtom);
  const [selectedMCate, setSelectedMCate] = useAtom(selectedMiddleCategoryAtom);
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);

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
      !selectedLCate ||
      !selectedMCate ||
      !imageFile ||
      !data.path ||
      !hashtags
    ) {
      toast.error("빈칸을 입력하세요.");
      return;
    }

    setValue("large_category_id", selectedLCate?.id);
    setValue("middle_category_id", selectedMCate?.id);

    const thumbnailParams = {
      file: imageFile,
      path: data.path,
    };
    const publicUrl = await getThumbnailUrl(thumbnailParams);
    setValue("thumbnail", publicUrl);

    const blogParams = {
      data: getValues(),
      hashtags: hashtags,
    };
    const isBloging = await postBlog(blogParams);
    if (isBloging) {
      toast.success("블로그 발행에 성공했습니다.");
      setSelectedLCate(RESET);
      setSelectedMCate(RESET);
      setHashtags(RESET);
      router.push("/");
    } else toast.error("블로그 발행에 실패했습니다.");
  };

  const handleClickResetBtn = () => {
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="포스트 작성" />
        <div className="flex gap-x-[5px]">
          <CommonButton
            onClick={handleClickResetBtn}
            className="px-3 py-1 text-[14px] text-white bg-black-AAA rounded-md"
          >
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
