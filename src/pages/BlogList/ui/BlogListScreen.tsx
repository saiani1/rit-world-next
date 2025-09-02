"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";

import { BlogItem, blogListAtom, BlogType, WriteButton } from "features/Blog";
import { isLoginAtom } from "entities/user";
import { Title } from "shared/ui";
import { CategoryListAtom } from "features/Category";

type BlogListScreenType = {
  data: BlogType[];
};

const BlogListScreen = ({ data }: BlogListScreenType) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const [isClient, setIsClient] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [blogList, setBlogList] = useAtom(blogListAtom);
  const isLogin = useAtomValue(isLoginAtom);
  const categoryList = useAtomValue(CategoryListAtom);

  useEffect(() => {
    setIsClient(true);
    setBlogList(data);
    if (categoryId) {
      const filteredData = data.filter(
        (blog) =>
          blog.large_category_id === categoryId ||
          blog.middle_category_id === categoryId
      );
      setBlogList(filteredData);
      const filteredCategory = categoryList?.filter(
        (cate) => cate.id === categoryId || cate.parent_id === categoryId
      );
      filteredCategory && setCategoryTitle(filteredCategory[0].title);
    }
  }, [categoryId, categoryList, data, setBlogList]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px] border-b">
        <div className="flex items-baseline gap-x-[5px]">
          {categoryId && (
            <span className="text-black-777 text-[17px]">카테고리 :</span>
          )}
          <Title name={categoryId ? categoryTitle : "전체 포스트"} />
        </div>
        <div className="flex gap-x-[13px]">
          {isLogin && isClient && <WriteButton />}
        </div>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px] pt-[10px]">
        {blogList && blogList.length !== 0 ? (
          blogList.map((blog) => <BlogItem key={blog.id} data={blog} />)
        ) : (
          <p className="mt-8 text-black-888">작성한 블로그 글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default BlogListScreen;
