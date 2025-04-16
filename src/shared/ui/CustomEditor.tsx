import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

type CustomEditorType<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
};

export const CustomEditor = <TFieldValues extends FieldValues>({
  control,
  name,
}: CustomEditorType<TFieldValues>) => {
  const {
    field: { onChange, ...field },
  } = useController({
    name,
    control,
  });

  return (
    <>
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
    </>
  );
};
