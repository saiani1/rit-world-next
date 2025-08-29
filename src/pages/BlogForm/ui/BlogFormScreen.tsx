"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { RESET } from "jotai/utils";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import {
  blogListAtom,
  BlogOption,
  BlogType,
  hashtagListAtom,
  selectedLargeCategoryAtom,
  selectedMiddleCategoryAtom,
  ThumbnailWithTitle,
} from "features/Blog";
import { CategoryType } from "entities/category";
import { getImageUrl, postBlog, updateBlog } from "entities/blog";
import { CommonButton, CommonInput, Title } from "shared/ui";

const CustomEditor = dynamic(() => import("shared/ui/CustomEditor"), {
  ssr: false,
});

type BlogFormScreenType = {
  categories: CategoryType[];
  isEdit?: Boolean;
};

const BlogFormScreen = ({ categories, isEdit }: BlogFormScreenType) => {
  const router = useRouter();
  const { blog } = useParams() || {};
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const blogListData = useAtomValue(blogListAtom);
  const [selectedLCate, setSelectedLCate] = useAtom(selectedLargeCategoryAtom);
  const [selectedMCate, setSelectedMCate] = useAtom(selectedMiddleCategoryAtom);
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);

  const { getValues, setValue, watch, register, control, handleSubmit, reset } =
    useForm<BlogType>();

  useEffect(() => {
    if (isEdit && blogListData.length !== 0) {
      const filteredBlog = blogListData.filter((item) => item.path === blog);
      if (filteredBlog && filteredBlog[0].blog_hashtag) {
        const hashtagNames: string[] = filteredBlog[0].blog_hashtag.map(
          (item) => item.hashtag_id.name
        );
        setHashtags(hashtagNames);
      }
      setPreviewUrl(filteredBlog[0]?.thumbnail);
      const categoryL = categories.find(
        (cate) => cate.title === filteredBlog[0]?.category_large?.title
      );
      setSelectedLCate(categoryL);
      const categoryM = categories.find(
        (cate) => cate.title === filteredBlog[0]?.category_middle?.title
      );
      setSelectedMCate(categoryM);
      reset(filteredBlog[0]);
    }
    if (!isEdit) {
      setSelectedLCate(RESET);
      setSelectedMCate(RESET);
      setHashtags(RESET);
    }
  }, [isEdit, blogListData]);

  const handleChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const onSubmit = async (data: BlogType) => {
    if (
      !selectedLCate ||
      !selectedMCate ||
      !previewUrl ||
      !data.path ||
      !hashtags
    ) {
      toast.error("빈칸을 입력하세요.");
      return;
    }

    setValue("large_category_id", selectedLCate?.id, { shouldDirty: true });
    setValue("middle_category_id", selectedMCate?.id, { shouldDirty: true });

    // previewUrl에 path가 포함되어 있으면 supabase에 업로드 하는 절차를 패스한다.
    const isSameImg = isEdit && previewUrl?.includes(blog as string);
    if (!isSameImg) {
      const thumbnailParams = {
        file: imageFile!,
        path: `blog-thumbnail/${data.path}`,
      };
      const publicUrl = await getImageUrl(thumbnailParams);
      if (publicUrl) setValue("thumbnail", publicUrl);
      else {
        toast.error("썸네일 추가에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    // isEdit일 경우, update함수 호출. postBlog에 hashtag로직 분리
    const blogParams = {
      data: getValues(),
      hashtags: hashtags,
    };
    const isBloging = isEdit
      ? await updateBlog(blogParams)
      : await postBlog(blogParams);
    if (isBloging) {
      toast.success(`블로그 ${isEdit ? "수정" : "발행"}에 성공했습니다.`);
      setSelectedLCate(RESET);
      setSelectedMCate(RESET);
      setHashtags(RESET);
      router.push("/");
    } else toast.error(`블로그 ${isEdit ? "수정" : "발행"}에 실패했습니다.`);
  };

  const handleClickResetBtn = () => {
    if (isEdit) router.back();
    else router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name={isEdit ? "포스트 수정" : "포스트 작성"} />
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
            {isEdit ? "수정" : "발행"}
          </CommonButton>
        </div>
      </div>
      <ThumbnailWithTitle
        previewUrl={previewUrl}
        handleChange={handleChangeFileInput}
        {...register("subject")}
      />
      {hashtags && <BlogOption categories={categories} />}
      <div className="flex flex-col gap-y-2 mb-[20px]">
        <CommonInput
          className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
          placeholder="요약글을 입력하세요."
          {...register("summary")}
        />
        <CommonInput
          className={`px-[10px] w-full h-[34px] rounded-[5px] text-[13px] ${isEdit ? "text-black-BBB bg-black-DDD cursor-not-allowed" : "bg-black-F5"}`}
          placeholder="path를 입력하세요."
          defaultValue=""
          disabled={isEdit ? true : false}
          {...register("path")}
        />
      </div>
      <CustomEditor
        control={control}
        name="content"
        path={watch("path")}
        initialValue={watch("content")}
      />
    </form>
  );
};

export default BlogFormScreen;
