"use client";
import { useEffect, useRef } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";

import { getImageUrl } from "entities/blog";
import { BlogType } from "features/Blog";

type CustomEditorType<TFieldValues extends FieldValues> = {
  control: Control<BlogType>;
  name: TFieldValues["path"];
  path: string;
};

export const CustomEditor = <TFieldValues extends FieldValues>({
  control,
  name,
  path,
}: CustomEditorType<TFieldValues>) => {
  const editorRef = useRef<Editor | null>(null);
  const {
    field: { onChange, ...field },
  } = useController({
    name,
    control,
  });

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown("");
    }
  }, []);

  useEffect(() => {
    if (!editorRef.current || !path) return;
    const editor = editorRef.current.getInstance();

    // 혹시 이전에 등록한 hook이 있으면 제거
    editor.removeHook("addImageBlobHook");

    // 새로운 hook 등록
    editor.addHook(
      "addImageBlobHook",
      async (blob: Blob, callback: (url: string, name: string) => void) => {
        const fileId = uuid();
        if (!path) return;
        const transformFile = new File([blob], fileId, { type: blob.type });
        const params = {
          file: transformFile,
          path: `content-images/${path}/${fileId}`,
        };
        const publicUrl = await getImageUrl(params);
        if (publicUrl) callback(publicUrl, fileId);
      }
    );
  }, [path]);

  return (
    <>
      <Editor
        {...field}
        ref={editorRef}
        onChange={() => {
          const markdown = editorRef.current?.getInstance().getMarkdown();
          onChange(markdown);
        }}
        previewStyle="tab"
        height="600px"
        initialValue=""
        initialEditType="markdown"
        hideModeSwitch={true}
        useCommandShortcut={false}
        language="ko-KR"
      />
    </>
  );
};
