"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  BlogOption,
  BlogType,
  ThumbnailWithTitle,
  WriteButton,
} from "features/Blog";
import { CustomEditor, Title } from "shared/ui";

const CreateBlogScreen = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { getValues, setValue, register, control, handleSubmit } =
    useForm<BlogType>();

  const handleChangeFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="포스트 작성" />
        <WriteButton page="작성" />
      </div>
      <ThumbnailWithTitle
        previewUrl={previewUrl}
        handleChange={handleChangeFileInput}
        {...register("subject")}
      />
      <BlogOption />
      <CustomEditor control={control} name="content" />
    </form>
  );
};

export default CreateBlogScreen;
