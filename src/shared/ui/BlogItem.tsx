import Image from "next/image";
import Hui from "public/assets/image/hui2.jpg";
import { Hashtag } from "./Hashtag";
import SideArrowIcon from "public/assets/svg/right-top-arrow-icon.svg";

export const BlogItem = ({
  data,
  direction,
}: {
  data?: any;
  direction?: "row" | "column";
}) => {
  return (
    <li className="w-[289px]">
      <button type="button" className="flex flex-col items-start text-left">
        <div className="w-[289px] overflow-hidden rounded-[5px]">
          <Image src={Hui} height={190} alt="후잇" />
        </div>
        <span className="mt-[15px] mb-[10px] text-[13px] text-black-888">
          2024.07.23
        </span>
        <div className="flex gap-x-[10px]">
          <p className="mb-[10px] text-[20px] text-black-444 font-semibold leading-6">
            Conversation With London Makr & Co.
          </p>
          <div className="flex shrink-0 justify-center items-center w-[20px] h-[20px]">
            <SideArrowIcon />
          </div>
        </div>
        <span className="text-[15px] text-black-555 leading-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </span>
        <ul className="flex gap-x-[3px] mt-[15px]">
          <Hashtag tagName="Design" size="s" />
          <Hashtag tagName="Programming" size="s" />
          <Hashtag tagName="Interview" size="s" />
        </ul>
      </button>
    </li>
  );
};
