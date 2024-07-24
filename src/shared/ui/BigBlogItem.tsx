import Image from "next/image";

import Hui from "public/assets/image/hui1.jpg";
import SideArrowIcon from "public/assets/svg/right-top-arrow-icon.svg";
import { Hashtag } from "./Hashtag";

export const BigBlogItem = () => {
  return (
    <div className="w-[400px]">
      <button type="button" className="flex flex-col items-start text-left">
        <div className="w-[400px] h-[358px] relative overflow-hidden rounded-[5px]">
          <Image src={Hui} style={{ objectFit: "cover" }} fill alt="후잇" />
        </div>
        <div className="mt-[15px]">
          <span className="mb-[10px] inline-block text-[13px] text-black-888">
            2024.07.23
          </span>
          <div className="gap-x-[10px] flex">
            <p className="mb-[10px] text-[20px] leading-6 text-black-444 font-semibold">
              Conversation With London Makr & Co.
            </p>
            <div className="flex shrink-0 justify-center items-center w-[20px] h-[20px]">
              <SideArrowIcon />
            </div>
          </div>
          <span className="text-[15px] leading-5 text-black-555 line-clamp-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. printing and typesetting industry.
          </span>
          <ul className="flex gap-x-[3px] mt-[15px]">
            <Hashtag tagName="Design" size="s" />
            <Hashtag tagName="Programming" size="s" />
            <Hashtag tagName="Interview" size="s" />
          </ul>
        </div>
      </button>
    </div>
  );
};
