"use client";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";

import { ButtonWrap } from "features/Blog";
import {
  BlogJpType,
  BlogType,
  VocabularyType,
  BlogVocabularyType,
} from "entities/blog";
import { isLoginAtom } from "entities/user";
import { CommonButton, CustomViewer, Hashtag } from "shared/ui";

type BlogContentScreenType = {
  data: BlogType | BlogJpType;
};

const BlogContentScreen = ({ data }: BlogContentScreenType) => {
  const isLogin = useAtomValue(isLoginAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const vocabList =
    "blog_vocabularies" in data && data.blog_vocabularies
      ? data.blog_vocabularies
          .map((item: BlogVocabularyType) => item.vocabularies)
          .filter((v: VocabularyType | undefined): v is VocabularyType => !!v)
      : [];

  return (
    <>
      {isMounted && (
        <div className="relative w-full">
          <div className="flex justify-between items-center mx-[20px] sm:mx-0">
            <div className="flex gap-x-2 mb-[5px] text-[13px] text-black-888">
              <span>{data.category_large?.title}</span>
              <span className="mt-[-1px]">{`<`}</span>
              <span>{data.category_middle?.title}</span>
            </div>
            <div>{isMounted && isLogin && <ButtonWrap id={data.id!} />}</div>
          </div>
          <div
            className="relative flex flex-col justify-end p-[20px] w-full h-[350px] overflow-hidden bg-cover bg-top"
            style={{
              backgroundImage: `url(${data.thumbnail || "/assets/image/default-image.jpg"})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black-444/70 to-transparent z-100" />
            <div className="relative">
              <p className="mb-[20px] sm:text-[33px] text-[28px] font-semibold text-white">
                {data.subject}
              </p>
              <div className="flex sm:flex-row flex-col justify-between items-start sm:gap-x-[50px] gap-y-[10px]">
                <div className="flex flex-col gap-y-[4px] text-white">
                  <span className="text-[13px]">Published on</span>
                  <span className="font-medium">
                    {dayjs(data.create_at).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col gap-y-[4px] text-white">
                  <span className="text-[13px]">
                    {data.blog_hashtag.length !== 0 ? "Hashtag" : ""}
                  </span>
                  <ul className="flex gap-x-1">
                    {data.blog_hashtag?.map((hash) => (
                      <Hashtag
                        page="content"
                        key={hash.hashtag_id.id}
                        name={hash.hashtag_id.name}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full my-[50px] px-[20px] sm:px-0">
            <CustomViewer initialValue={data.content} />
          </div>

          {/* 어휘 정리 섹션 */}
          {vocabList.length > 0 && (
            <div className="w-full mb-[50px] px-[20px] sm:px-0">
              <div className="border border-purple-50 rounded-[12px] bg-black-10 p-5 flex flex-col gap-y-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="pb-2 border-b border-black-EEE">
                  <h3 className="text-black-333 text-[14px] font-bold">어휘</h3>
                </div>
                <ul className="flex flex-wrap gap-2.5 pl-0.5 list-none">
                  {vocabList.map((vocab) => (
                    <li key={vocab.id}>
                      <CommonButton className="inline-flex items-center px-4 py-2 bg-white border border-black-EEE rounded-[12px] text-[13px] text-black-333 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:border-purple-100 hover:bg-purple-50/5 hover:-translate-y-[0.5px] hover:shadow-md transition-all duration-200 select-none group text-left cursor-default">
                        <span className="font-bold text-black-333 group-hover:text-purple-100 transition-colors">
                          {vocab.word}
                        </span>
                        {vocab.reading && (
                          <span className="text-[11px] text-purple-100 font-medium font-sans ml-1">
                            [{vocab.reading}]
                          </span>
                        )}
                        <span className="text-black-BBB mx-1.5 select-none text-[11px]">
                          :
                        </span>
                        <span className="text-black-777">{vocab.meaning}</span>
                      </CommonButton>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BlogContentScreen;
