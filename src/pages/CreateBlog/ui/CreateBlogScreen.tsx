"use client";
import { useForm, useController } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

type formData = {
  subject: string;
  content: string;
};

const CreateBlogScreen = () => {
  const { getValues, setValue, register, control, handleSubmit } =
    useForm<formData>();

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
      <div className="flex justify-between pb-[15px] mb-[10px] border-b border-b-[#ddd]">
        {/* <h2 className="text-[22px] text-[#444] font-semibold">블로그 쓰기</h2> */}
      </div>
      <input
        type="text"
        className="flex w-full mb-[10px] px-[15px] py-[5px] border rounded-[5px]"
        {...register("subject")}
      />
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
      <div className="flex justify-center items-center gap-x-[10px] mt-[10px]">
        <button
          type="reset"
          className="px-[25px] py-[7px] text-[#777] font-medium border border-[#ddd] rounded-[3px]"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-[25px] py-[7px] bg-[#049DD9] text-white font-medium rounded-[3px]"
        >
          발행
        </button>
      </div>
    </form>
  );
};

export default CreateBlogScreen;
