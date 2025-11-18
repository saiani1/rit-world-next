import { useState } from "react";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";

import { CommonInput, Hashtag } from "shared/ui";
import { hashtagListAtom } from "../model";

export const HashtagList = () => {
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);
  const [inputValue, setInputValue] = useState("");

  const handleClickHashtag = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = (e.currentTarget as HTMLButtonElement).name;
    if (!name) return;
    const filterHashtag = hashtags?.filter((hashtag) => hashtag !== name);
    setHashtags(filterHashtag);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newHashtag = inputValue.trim();
      setHashtags((prevHashtags) => {
        if (!prevHashtags.includes(newHashtag)) {
          return [...prevHashtags, newHashtag];
        }
        return prevHashtags;
      });
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-1 px-[10px] w-full min-w-[100px] items-center bg-black-F5 rounded-[5px]">
      <ul className="flex gap-x-1 mb-[3px]">
        <AnimatePresence>
          {hashtags?.map((tag) => (
            <motion.li
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <Hashtag page="edit" name={tag} onClick={handleClickHashtag} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <CommonInput
        value={inputValue}
        className="px-[10px] w-full min-w-[100px] h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
        placeholder={hashtags.length !== 0 ? "" : "해시태그를 입력하세요."}
        onKeyDown={handleKeyDown}
        onChange={handleChangeInput}
      />
    </div>
  );
};
