import toast from "react-hot-toast";

import { CommonButton } from "./CommonButton";

type TooltipType = {
  data: string;
};

export const Tooltip = ({ data }: TooltipType) => {
  const handleBtnClick = () => {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        toast.success("이메일 주소가 복사되었습니다.");
      })
      .catch((err) => {
        toast.error("복사 실패, 다시 시도해주세요.");
      });
  };

  return (
    <div className="absolute top-[30px] left-[-20px] flex items-center gap-x-[10px] px-3 py-2 bg-black-777 rounded-[5px] z-[999]">
      <div className="absolute top-[-6px] left-[24px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-black-777" />
      <p className="text-white text-[15px]">{data}</p>
      <CommonButton
        onClick={handleBtnClick}
        className="px-2 text-[13px] text-black-555 bg-black-50 rounded-sm whitespace-nowrap"
      >
        복사
      </CommonButton>
    </div>
  );
};
