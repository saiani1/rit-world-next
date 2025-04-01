"use client";
import { useForm, useController } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

import { Selectbox, Title, WriteButton } from "shared/index";
import ImageIcon from "public/assets/svg/image-icon.svg";
import { HashtagList } from "features/Blog";

type FormDataType = {
  subject: string;
  content: string;
  hashtag: string[];
};

const CreateBlogScreen = () => {
  const { getValues, setValue, register, control, handleSubmit } =
    useForm<FormDataType>();

  const {
    field: { onChange, ...field },
  } = useController({
    name: "content",
    control,
  });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="포스트 작성" />
        <WriteButton />
      </div>
      <div className="relative flex flex-col gap-y-4 justify-end items-center pb-[20px] mb-[12px] w-full h-[175px] bg-black-F5 rounded-[5px]">
        <button type="button">
          <ImageIcon />
        </button>
        <span className="text-black-999 text-[12px] font-light">
          썸네일을 업로드하려면 아이콘을 클릭하세요.
        </span>
        <input
          type="text"
          className="absolute left-0 bottom-0 flex w-full px-[16px] py-[2px] bg-transparent rounded-[5px] text-[42px] font-medium text-black-999"
          placeholder="제목을 입력하세요."
          {...register("subject")}
        />
      </div>
      <div className="flex gap-x-2 mb-[20px]">
        <Selectbox placeholder="카테고리 대분류" />
        <Selectbox placeholder="카테고리 중분류" />
        <HashtagList {...register("hashtag")} />
      </div>
      <Editor
        {...field}
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        onEditorChange={onChange}
        init={{
          height: 500,
          menubar: false,
          statusbar: false,
          promotion: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "media",
            "table",
          ],
          toolbar:
            " blocks | image table " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | ",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </form>
  );
};

export default CreateBlogScreen;
