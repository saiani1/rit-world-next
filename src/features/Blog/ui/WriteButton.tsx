"use client";
import { useRouter } from "next/navigation";

import PencilIcon from "public/assets/svg/pencil-icon.svg";
import { CommonButton } from "shared/ui";

export const WriteButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/create");
  };

  return (
    <CommonButton
      aria-label="블로그 작성"
      className="flex justify-center items-center w-[25px] h-[25px]"
      onClick={handleClick}
    >
      <PencilIcon />
    </CommonButton>
  );
};
