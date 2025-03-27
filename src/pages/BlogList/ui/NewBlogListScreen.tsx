import { useState } from "react";
import { motion } from "framer-motion";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import {
  BlogItem,
  FlexableBlogItem,
  FilterButton,
  Title,
  WriteButton,
  Hashtag,
} from "shared/index";

const HashtagTrends = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="border-b-[2px] border-black-EEE mb-[35px] pb-[20px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-[15px]">
          <Title name="해시태그" />
          <button
            type="button"
            className={`flex justify-center items-center w-[20px] h-[20px] rounded-[2px] bg-black-EEE`}
            onClick={handleClick}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowIcon className="rotate-180" />
            </motion.div>
          </button>
        </div>
        <div className="flex gap-x-[13px]">
          <WriteButton />
          <FilterButton />
        </div>
      </div>
      {isOpen && (
        <ul className="flex flex-wrap gap-x-[5px] gap-y-[10px] mt-[20px]">
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
          <Hashtag tagName="Degisn" size="m" />
        </ul>
      )}
    </div>
  );
};

const NewBlogListScreen = () => {
  return (
    <>
      <div>
        <HashtagTrends />
      </div>
      <div>
        <div className="flex justify-between items-center pb-[15px] mb-[10px]">
          <Title name="최신 포스트" />
        </div>
        <ul className="flex justify-between gap-x-[20px] gap-y-[40px]">
          <li>
            <FlexableBlogItem />
          </li>
          <li>
            <ul className="flex flex-col gap-y-[25px]">
              <BlogItem direction="row" />
              <BlogItem direction="row" />
              <BlogItem direction="row" />
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NewBlogListScreen;
