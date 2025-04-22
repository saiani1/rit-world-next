"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { BlogItem, FilterButton, WriteButton } from "features/Blog";
import { Title } from "shared/ui";

const AllBlogListScreen = () => {
  const isLogin = Cookies.get("login") === "Y";
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="전체 포스트" />
        <div className="flex gap-x-[13px]">
          {isLogin && isClient && <WriteButton />}
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
