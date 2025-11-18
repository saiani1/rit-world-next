"use client";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

import { CommonButton } from "shared/ui";

type RedirectButtonType = {
  name: string;
  path?: string;
};

export const RedirectButton = ({ name, path }: RedirectButtonType) => {
  const router = useRouter();

  const handleClickButton = () => {
    router.replace(`${path ? path : "/ko"}`);
  };

  return (
    <CommonButton
      className={`flex items-center gap-x-1 px-[10px] py-[4px] ${path ? "bg-[#7c8798]" : "bg-black-777"} text-white text-[16px] rounded-md`}
      onClick={handleClickButton}
    >
      <IoIosArrowBack fill="#fff" />
      <span className={`inline-block ${path ? "" : "mt-[-2px]"}`}>{name}</span>
    </CommonButton>
  );
};
