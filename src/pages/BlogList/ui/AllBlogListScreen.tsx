"use client";
import { useRouter } from "next/navigation";

import { BlogItem, FilterButton, Title, WriteButton } from "shared/index";

export const AllBlogListScreen = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="전체 포스트" />
        <div className="flex gap-x-[13px]">
          <WriteButton />
          <FilterButton />
        </div>
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
