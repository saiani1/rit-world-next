import { forwardRef } from "react";
import { HashtagButton } from "./HashtagButton";

export const HashtagList = forwardRef((ref) => {
  return (
    <div className="flex px-[10px] w-full items-center bg-black-F5 rounded-[5px]">
      <ul className="flex gap-x-1 mb-[3px]">
        <HashtagButton />
        <HashtagButton />
        <HashtagButton />
      </ul>
      <input
        type="text"
        className="px-[10px] w-full h-[34px] bg-black-F5 rounded-[5px] text-[13px]"
        placeholder="해시태그를 입력하세요."
      />
    </div>
  );
});
HashtagList.displayName = "HashtagList";
