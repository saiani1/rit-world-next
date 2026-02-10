"use client";
import { useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { type Control, type FieldValues, useController } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { commands } from "@uiw/react-md-editor";
import toast from "react-hot-toast";

import "./markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { BlogJpType, BlogType, getImageUrl } from "entities/blog";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
}: CustomEditorType<TFieldValues>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  const uploadImage = useCallback(
    async (file: File) => {
      const fileId = uuid();
      const currentPath = path || "temp";
      const params = {
        file,
        path: `content-images/${currentPath}/${fileId}`,
      };
      try {
        const url = await getImageUrl(params);
        if (!url) throw new Error("Upload failed");
        return url;
      } catch (error) {
        console.error(error);
        toast.error("Image upload failed");
        throw error;
      }
    },
    [path]
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      const imageMarkdown = `![image](${url})`;
      const newValue = value ? `${value}\n${imageMarkdown}` : imageMarkdown;
      onChange(newValue);
    } catch (error) {
      console.error(error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const memoizedCommands = useMemo(() => {
    const imageCommand = {
      name: "image",
      keyCommand: "image",
      buttonProps: { "aria-label": "Insert Image" },
      icon: (
        <svg viewBox="0 0 20 20" width="12px" height="12px">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
          />
        </svg>
      ),
      execute: () => {
        fileInputRef.current?.click();
      },
    };

    return [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.divider,
      commands.link,
      commands.quote,
      commands.code,
      commands.codeBlock,
      imageCommand,
      commands.divider,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand,
    ];
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onImagePastedOrDropped = useCallback(
    async (
      event:
        | React.DragEvent<HTMLDivElement>
        | React.ClipboardEvent<HTMLDivElement>
    ) => {
      const files =
        (event as React.DragEvent<HTMLDivElement>).dataTransfer?.files ||
        (event as React.ClipboardEvent<HTMLDivElement>).clipboardData?.files;

      if (files && files.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        const file = files[0];
        if (file.type.startsWith("image/")) {
          try {
            const url = await uploadImage(file);
            const imageMarkdown = `![image](${url})`;

            const target = event.target as HTMLTextAreaElement;
            if (target && target.tagName === "TEXTAREA") {
              const start = target.selectionStart;
              const end = target.selectionEnd;
              const newValue =
                target.value.substring(0, start) +
                imageMarkdown +
                target.value.substring(end);
              onChange(newValue);
            } else {
              const newValue = value
                ? `${value}\n${imageMarkdown}`
                : imageMarkdown;
              onChange(newValue);
            }
          } catch (error) {
            console.error("Image upload failed:", error);
          }
        }
      }
    },
    [onChange, uploadImage, value]
  );

  return (
    <div
      className="w-full bg-white"
      data-color-mode="light"
      onDragOver={onDragOver}
      onDrop={onImagePastedOrDropped}
      onPaste={onImagePastedOrDropped}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <MDEditor
        value={value || initialValue || ""}
        onChange={onChange}
        height={500}
        commands={memoizedCommands}
        textareaProps={{
          placeholder: "Please enter Markdown text",
        }}
      />
    </div>
  );
};

export default CustomEditor;
