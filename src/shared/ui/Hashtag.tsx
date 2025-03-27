"use client";
import { useRouter } from "next/navigation";

export const Hashtag = ({
  tagName,
  size,
  disabled,
  url,
}: {
  tagName: string;
  size: "s" | "m";
  disabled?: boolean;
  hasBorder?: boolean;
  colorIdx?: number;
  url?: string;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!disabled && url) router.push(url);
  };

  return (
    <li>
      <div
        className={`flex items-center px-[10px] rounded-full bg-purple-100 text-white ${size === "s" ? "h-[20px] text-[11px]" : "h-[24px] text-[13px]"}`}
        onClick={handleClick}
      >
        <span>{tagName}</span>
      </div>
    </li>
  );
};
