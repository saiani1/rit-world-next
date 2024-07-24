"use client";
import { useRouter } from "next/navigation";

import { BlogItem, Title } from "shared/index";

export const BlogListScreen = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between pb-[15px] mb-[10px] border-b border-b-[#ddd]">
        <Title name="전체 포스트" />
        <button
          type="button"
          className="px-[15px] py-[5px] text-[#777] border border-[#ddd] rounded-[5px]"
          onClick={() => router.push("/create")}
        >
          글쓰기
        </button>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px]">
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
        <BlogItem />
      </ul>
    </div>
  );
};
