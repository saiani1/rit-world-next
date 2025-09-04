import { useLocale, useTranslations } from "next-intl";
import { CommonButton } from "./CommonButton";

type TooltipType = {
  text: string;
  hasButton?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Tooltip = ({ text, hasButton, onClick }: TooltipType) => {
  const t = useTranslations("Profile");

  return (
    <div className="absolute top-[30px] left-[-20px] flex items-center gap-x-[10px] px-3 py-2 bg-black-777 rounded-[5px] z-[999]">
      <div className="absolute top-[-6px] left-[24px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-black-777" />
      <p className="text-white text-[15px]">{text}</p>
      {hasButton && (
        <CommonButton
          onClick={onClick}
          className="px-2 text-[13px] text-black-555 bg-black-50 rounded-sm whitespace-nowrap"
        >
          {t("copy")}
        </CommonButton>
      )}
    </div>
  );
};
