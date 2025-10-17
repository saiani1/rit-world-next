"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

import { blogListAtom, ButtonWrap } from "features/Blog";
import { BlogJpType, BlogType } from "entities/blog";
import { isLoginAtom } from "entities/user";
import { Hashtag } from "shared/ui";

const BlogContentPage = () => {
  const { blog } = useParams() as { blog: string };
  const blogListData = useAtomValue(blogListAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const [filteredData, setFilteredData] = useState<BlogType | BlogJpType>();

  useEffect(() => {
    const filterdBlog = blogListData.filter((item) => item.path === blog);
    setFilteredData(filterdBlog[0]);
  }, [blogListData, blog]);

  return (
    <>
      {filteredData && (
        <div className="relative w-full">
          <div className="flex justify-between items-center mx-[20px] sm:mx-0">
            <div className="flex gap-x-2 mb-[5px] text-[13px] text-black-888">
              <span>{filteredData.category_large?.title}</span>
              <span className="mt-[-1px]">{`<`}</span>
              <span>{filteredData.category_middle?.title}</span>
            </div>
            <div>{isLogin && <ButtonWrap id={filteredData.id!} />}</div>
          </div>
          <div
            className="relative flex flex-col justify-end p-[20px] w-full h-[350px] overflow-hidden bg-cover bg-top"
            style={{ backgroundImage: `url(${filteredData.thumbnail}` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black-444/70 to-transparent z-100" />
            <div className="relative">
              <p className="mb-[20px] sm:text-[33px] text-[28px] font-semibold text-white">
                {filteredData.subject}
              </p>
              <div className="flex sm:flex-row flex-col justify-between items-start sm:gap-x-[50px] gap-y-[10px]">
                <div className="flex flex-col gap-y-[4px] text-white">
                  <span className="text-[13px]">Published on</span>
                  <span className="font-medium">
                    {dayjs(filteredData.create_at).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col gap-y-[4px] text-white">
                  <span className="text-[13px]">Hashtag</span>
                  <ul className="flex gap-x-1">
                    {filteredData.blog_hashtag?.map((hash) => (
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
          <div className="prose max-w-full my-[50px] mx-[20px] sm:mx-0">
            <ReactMarkdown>{filteredData.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogContentPage;
