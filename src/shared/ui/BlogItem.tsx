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
    <li className={`${direction === "row" ? "" : "w-[250px]"}`}>
      <button
        type="button"
        className={`flex ${direction === "row" ? "flex-row gap-x-[15px]" : "flex-col"} items-start text-left`}
      >
        <div
          className={`${direction === "row" ? "shrink-0 w-[240px] h-[145px]" : "w-[250px] h-[150px]"} relative overflow-hidden rounded-[5px]`}
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
            className={`${direction === "row" ? "mb-[8px]" : "mb-[8px]"} inline-block text-[13px] text-black-888`}
          >
            2024.07.23
          </span>
          <div
            className={`${direction === "row" ? "gap-x-[5px] mb-[2px]" : "gap-x-[10px]"} flex`}
          >
            <p
              className={`${direction === "row" ? "mb-[5px] text-[17px] leading-5" : "mb-[6px] text-[19px] leading-6"} text-black-444 font-semibold`}
            >
              Conversation With London Makr & Co.
            </p>
            <div
              className={`flex shrink-0 justify-center items-center ${direction === "row" ? "mt-[3px] w-[14px] h-[14px]" : "mt-[2px] w-[18px] h-[18px]"}`}
            >
              <SideArrowIcon className="fill-black-999" />
            </div>
          </div>
          <span
            className={`${direction === "row" ? "text-[12px] leading-4" : "text-[13px] leading-5"} text-black-777 line-clamp-2`}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. printing and typesetting industry.
          </span>
          <ul
            className={`flex gap-x-[3px] ${direction === "row" ? "mt-[13px]" : "mt-[15px]"} `}
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
