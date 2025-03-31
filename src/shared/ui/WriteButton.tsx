"use client";
import { useRouter } from "next/navigation";

import PencilIcon from "public/assets/svg/pencil-icon.svg";

type WriteButtonType = {
  page?: string;
};

export const WriteButton = ({ page }: WriteButtonType) => {
  const router = useRouter();
  const handleClick = () => {
    if (page) console.log("이예에");
    else router.push("/create");
  };

  return (
    <button
      type="button"
      aria-label="블로그 작성"
      className="flex justify-center items-center w-[25px] h-[25px]"
      onClick={handleClick}
    >
      <PencilIcon />
    </button>
  );
};
