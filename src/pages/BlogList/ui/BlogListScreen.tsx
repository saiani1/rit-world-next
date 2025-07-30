"use client";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";

import { BlogItem, blogListAtom, BlogType, WriteButton } from "features/Blog";
import { Title } from "shared/ui";

type BlogListScreenType = {
  data: BlogType[];
};

const BlogListScreen = ({ data }: BlogListScreenType) => {
  const setBlogList = useSetAtom(blogListAtom);
  const isLogin = Cookies.get("login") === "Y";
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setBlogList(data);
  }, [data]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="전체 포스트" />
        <div className="flex gap-x-[13px]">
          {isLogin && isClient && <WriteButton />}
        </div>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px]">
        {data.map((blog) => (
          <BlogItem key={blog.id} data={blog} />
        ))}
      </ul>
    </div>
  );
};

export default BlogListScreen;
