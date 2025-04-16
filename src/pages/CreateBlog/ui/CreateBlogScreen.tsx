"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ImageIcon from "public/assets/svg/image-icon.svg";
import { BlogType, HashtagList, WriteButton } from "features/Blog";
import {
  CommonInput,
  CustomEditor,
  FileInput,
  Selectbox,
  Title,
} from "shared/ui";

const CreateBlogScreen = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [largeCategoryId, setLargeCategoryId] = useState<string>("");
  const [middleCategoryId, setMiddleCategoryId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { getValues, setValue, register, control, handleSubmit } =
    useForm<BlogType>();

  const tmpArr = ["하나", "둘", "셋"];

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
        <WriteButton />
      </div>
      <div
        style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}}
        className={`relative flex flex-col gap-y-4 justify-end items-center pb-[20px] mb-[12px] w-full h-[175px] ${previewUrl ? "bg-cover bg-top" : "bg-black-F5"} rounded-[5px]`}
      >
        <FileInput
          className="hidden"
          onChange={handleChangeFileInput}
          id="imageInput"
          accept="image/*"
          labelStyle={`${previewUrl ? "opacity-50" : ""} cursor-pointer`}
          icon={<ImageIcon />}
        />
        <span
          className={`${previewUrl ? "opacity-70" : ""} text-black-999 text-[12px] font-light`}
        >
          썸네일을 업로드하려면 아이콘을 클릭하세요.
        </span>
        <CommonInput
          className="absolute left-0 bottom-0 flex w-full px-[16px] py-[2px] bg-transparent rounded-[5px] text-[42px] font-medium text-black-999"
          placeholder="제목을 입력하세요."
          {...register("subject")}
        />
      </div>
      <div className="flex gap-x-2 mb-[20px]">
        <Selectbox
          data={tmpArr}
          selectOption={largeCategoryId}
          setSelectOption={setLargeCategoryId}
          placeholder="카테고리 대분류"
        />
        <Selectbox
          data={tmpArr}
          selectOption={middleCategoryId}
          setSelectOption={setMiddleCategoryId}
          placeholder="카테고리 중분류"
        />
        <HashtagList hashtags={hashtags} setHashtags={setHashtags} />
      </div>
      <CustomEditor control={control} name="content" />
    </form>
  );
};

export default CreateBlogScreen;
