import { useAtom } from "jotai";

import { HashtagList } from "./HashtagList";
import {
  hashtagListAtom,
  largeCategoryAtom,
  middleCategoryAtom,
} from "../model";
import { Selectbox } from "shared/ui";

export const BlogOption = () => {
  const [largeCategoryId, setLargeCategoryId] = useAtom(largeCategoryAtom);
  const [middleCategoryId, setMiddleCategoryId] = useAtom(middleCategoryAtom);
  const [hashtags, setHashtags] = useAtom(hashtagListAtom);

  const tmpArr = ["하나", "둘", "셋"];

  return (
    <div className="flex gap-x-2 mb-[20px]">
      <Selectbox
        data={tmpArr}
        selectOption={largeCategoryId}
        setSelectOption={setLargeCategoryId}
        placeholder="카테고리 대분류"
      />
      <Selectbox
        data={tmpArr}
        selectOption={middleCategoryId}
        setSelectOption={setMiddleCategoryId}
        placeholder="카테고리 중분류"
      />
      <HashtagList hashtags={hashtags} setHashtags={setHashtags} />
    </div>
  );
};
