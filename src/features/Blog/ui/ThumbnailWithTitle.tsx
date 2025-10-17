import { forwardRef } from "react";

import ImageIcon from "public/assets/svg/image-icon.svg";
import { FileInput } from "shared/ui";

type ThumbnailWithTitleType = (
  | React.ComponentProps<"input">
  | React.ComponentProps<"textarea">
) & {
  previewUrl: string | null;
  titleData?: string;
  page: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ThumbnailWithTitle = forwardRef<
  HTMLTextAreaElement,
  ThumbnailWithTitleType
>(({ previewUrl, titleData, page, handleChange, ...rest }, ref) => {
  const isTranslate = page === "editTranslate" || page === "translate";

  return (
    <div
      style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : {}}
      className={`relative flex flex-col gap-y-4 justify-end items-center pb-[20px] mb-[12px] w-full h-[175px] ${previewUrl ? "bg-cover bg-top" : "bg-black-F5"} rounded-[5px]`}
    >
      {previewUrl && (
        <div
          className={`absolute inset-0 rounded-[5px] pointer-events-none bg-black-EEE/80`}
        />
      )}
      <FileInput
        className="hidden"
        onChange={handleChange}
        id="imageInput"
        accept="image/*"
        labelStyle={`${previewUrl ? "opacity-50" : ""} ${isTranslate ? "cursor-no-allowed hidden" : "cursor-pointer"}`}
        icon={<ImageIcon />}
        disabled={page === "editTranslate" || page === "translate"}
      />
      <span
        className={`${previewUrl ? "opacity-70" : ""} ${isTranslate ? "hidden" : ""} text-black-999 text-[12px] font-light`}
      >
        썸네일을 업로드하려면 아이콘을 클릭하세요.
      </span>
      {page === "translate" && (
        <p className="absolute left-[20px] bottom-[60px] text-[20px] font-regular opacity-40">
          {titleData}
        </p>
      )}
      <textarea
        className="absolute left-0 bottom-0 flex flex-wrap w-full px-[16px] py-[2px] bg-transparent rounded-[5px] text-[42px] font-medium text-black-777 z-100"
        placeholder="제목을 입력하세요."
        ref={ref}
        rows={1}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    </div>
  );
});
ThumbnailWithTitle.displayName = "ThumbnailWithTitle";
