import Image from "next/image";
import Hui from "public/assets/image/hui2.jpg";
import Rui from "public/assets/image/rui.jpg";
import { Hashtag } from "./Hashtag";
import SideArrowIcon from "public/assets/svg/right-top-arrow-icon.svg";

export const BlogItem = ({
  data,
  direction,
}: {
  data?: any;
  direction?: "row" | "column";
}) => {
  const height = direction === "row" ? 154 : 190;

  return (
    <li className={`${direction === "row" ? "" : "w-[289px]"}`}>
      <button
        type="button"
        className={`flex ${direction === "row" ? "flex-row gap-x-[15px]" : "flex-col"} items-start text-left`}
      >
        <div
          className={`${direction === "row" ? "shrink-0 w-[253px] h-[154px]" : "w-[289px] h-[190px]"} relative overflow-hidden rounded-[5px]`}
        >
          <Image
            src={direction === "row" ? Rui : Hui}
            style={{ objectFit: "cover" }}
            fill
            alt="후잇"
          />
        </div>
        <div className={`${direction === "row" ? "w-[225px]" : "mt-[15px]"}`}>
          <span
            className={`${direction === "row" ? "mb-[8px]" : "mb-[10px]"} inline-block text-[13px] text-black-888`}
          >
            2024.07.23
          </span>
          <div
            className={`${direction === "row" ? "gap-x-[5px] mb-[2px]" : "gap-x-[10px]"} flex`}
          >
            <p
              className={`${direction === "row" ? "mb-[5px] text-[17px] leading-5" : "mb-[10px] text-[20px] leading-6"} text-black-444 font-semibold`}
            >
              Conversation With London Makr & Co.
            </p>
            <div className="flex shrink-0 justify-center items-center w-[20px] h-[20px]">
              <SideArrowIcon />
            </div>
          </div>
          <span
            className={`${direction === "row" ? "text-[13px] leading-4" : "text-[15px] leading-5"} text-black-555 line-clamp-2`}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. printing and typesetting industry.
          </span>
          <ul
            className={`flex gap-x-[3px] ${direction === "row" ? "mt-[18px]" : "mt-[15px]"} `}
          >
            <Hashtag tagName="Design" size="s" />
            <Hashtag tagName="Programming" size="s" />
            <Hashtag tagName="Interview" size="s" />
          </ul>
        </div>
      </button>
    </li>
  );
};
