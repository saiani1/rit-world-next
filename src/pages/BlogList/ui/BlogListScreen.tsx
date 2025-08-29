"use client";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { BlogItem, blogListAtom, BlogType, WriteButton } from "features/Blog";
import { isLoginAtom } from "entities/user";
import { Title } from "shared/ui";

type BlogListScreenType = {
  data: BlogType[];
};

const BlogListScreen = ({ data }: BlogListScreenType) => {
  const setBlogList = useSetAtom(blogListAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setBlogList(data);
  }, [data, setBlogList]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="전체 포스트" />
        <div className="flex gap-x-[13px]">
          {isLogin && isClient && <WriteButton />}
        </div>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px]">
        {data && data.length !== 0 ? (
          data.map((blog) => <BlogItem key={blog.id} data={blog} />)
        ) : (
          <p className="mt-8 text-black-888">작성한 블로그 글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default BlogListScreen;
