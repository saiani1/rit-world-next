import { useState } from "react";
import { HashtagButton } from "./HashtagButton";

type HashtagListType = {
  hashtags: string[];
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
};
export const HashtagList = ({ hashtags, setHashtags }: HashtagListType) => {
  const [inputValue, setInputValue] = useState("");

  const handleClickHashtag = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = (e.currentTarget as HTMLButtonElement).name;
    const filterHashtag = hashtags.filter((hashtag) => hashtag !== name);
    setHashtags(filterHashtag);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && inputValue.trim() !== "") {
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
    <div className="flex px-[10px] w-full items-center bg-black-F5 rounded-[5px]">
      <ul className="flex gap-x-1 mb-[3px]">
        {hashtags.map((tag, i) => (
          <HashtagButton
            key={`hashtag-${i}`}
            tag={tag}
            onClick={handleClickHashtag}
          />
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
        placeholder="해시태그를 입력하세요."
        onChange={handleChangeInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
