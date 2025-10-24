"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Control, type FieldValues, useController } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { Editor } from "@toast-ui/react-editor";

import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import "./editor.css";
import { BlogJpType, BlogType, getImageUrl } from "entities/blog";
import { useBreakpoint } from "shared/hooks/useBreakpoint";
import { loadCodeSyntaxHighlight } from "shared/lib";

type CustomEditorType<TFieldValues extends FieldValues> = {
  control: Control<BlogType | BlogJpType, any>;
  name: TFieldValues["path"];
  path: string;
  initialValue?: string;
  isTranslatePage?: boolean;
  page: string;
};

const CustomEditor = <TFieldValues extends FieldValues>({
  control,
  name,
  path,
  initialValue,
  isTranslatePage,
  page,
}: CustomEditorType<TFieldValues>) => {
  const editorRef = useRef<Editor | null>(null);
  const isDesktop = useBreakpoint(1200);
  const [plugins, setPlugins] = useState<any[]>([]);

  const previewStyle = useMemo(
    () => (isTranslatePage ? "tab" : isDesktop ? "vertical" : "tab"),
    [isDesktop, isTranslatePage]
  );

  const {
    field: { onChange, ...field },
  } = useController({
    name,
    control,
  });

  useEffect(() => {
    const loadPlugins = async () => {
      const { codeSyntaxHighlight, Prism } = await loadCodeSyntaxHighlight();
      setPlugins([[codeSyntaxHighlight, { highlighter: Prism }]]);
    };

    loadPlugins();
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
      {(initialValue !== undefined || page === "create") && (
        <Editor
          {...field}
          ref={editorRef}
          height="auto"
          onChange={() => {
            const markdown = editorRef.current?.getInstance().getMarkdown();
            onChange(markdown);
          }}
          initialValue={initialValue ?? ""}
          previewStyle={previewStyle}
          initialEditType="markdown"
          hideModeSwitch={true}
          useCommandShortcut={false}
          language="ko-KR"
          autofocus={false}
          plugins={plugins}
        />
      )}
    </>
  );
};

export default CustomEditor;
