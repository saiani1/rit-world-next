"use client";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

import { BlogItem, FilterButton, WriteButton } from "features/Blog";
import { loginAtom } from "entities/user";
import { Title } from "shared/ui";

const AllBlogListScreen = () => {
  const isLogin = useAtomValue(loginAtom);
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="전체 포스트" />
        <div className="flex gap-x-[13px]">
          {isLogin && <WriteButton />}
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

export default AllBlogListScreen;
