"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";

import "@toast-ui/editor/toastui-editor.css";
import "shared/ui/editor.css";
import type { ViewerProps } from "@toast-ui/react-editor";
import { ButtonWrap } from "features/Blog";
import { BlogJpType, BlogType } from "entities/blog";
import { isLoginAtom } from "entities/user";
import { Hashtag } from "shared/ui";
import { loadCodeSyntaxHighlight } from "shared/lib";

const Viewer = dynamic(
  async () => {
    const { Viewer } = await import("@toast-ui/react-editor");
    const { codeSyntaxHighlight, Prism } = await loadCodeSyntaxHighlight();

    const ViewerWithPlugins = (props: ViewerProps) => (
      <Viewer
        {...props}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      />
    );
    ViewerWithPlugins.displayName = "Viewer";
    return ViewerWithPlugins;
  },
  {
    ssr: false,
  }
);

type BlogContentScreenType = {
  data: BlogType | BlogJpType;
};

const BlogContentScreen = ({ data }: BlogContentScreenType) => {
  const isLogin = useAtomValue(isLoginAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
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
                      page="blog"
                      key={hash.hashtag_id.id}
                      name={hash.hashtag_id.name}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full my-[50px] px-[20px] sm:px-0">
          <Viewer initialValue={data.content} />
        </div>
      </div>
    </>
  );
};

export default BlogContentScreen;
