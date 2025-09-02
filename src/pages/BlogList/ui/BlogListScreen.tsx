"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";

import { BlogItem, BlogType, WriteButton } from "features/Blog";
import { isLoginAtom } from "entities/user";
import { Title } from "shared/ui";
import { CategoryListAtom } from "features/Category";

type BlogListScreenProps = {
  data: BlogType[];
};

const BlogListScreen = ({ data }: BlogListScreenProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const isLogin = useAtomValue(isLoginAtom);
  const categoryList = useAtomValue(CategoryListAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { blogList, categoryTitle } = useMemo(() => {
    if (!categoryId) {
      return { blogList: data, categoryTitle: "전체 포스트" };
    }

    const filteredList = data.filter(
      (blog) =>
        blog.large_category_id === categoryId ||
        blog.middle_category_id === categoryId
    );

    const currentCategory = categoryList?.find(
      (cate) => cate.id === categoryId
    );

    return {
      blogList: filteredList,
      categoryTitle: currentCategory?.title || "카테고리 없음",
    };
  }, [categoryId, data, categoryList]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px] border-b">
        <div className="flex items-baseline gap-x-[5px]">
          {categoryId && (
            <span className="text-black-777 text-[17px]">카테고리 :</span>
          )}
          <Title name={categoryTitle} />
        </div>
        <div className="flex gap-x-[13px]">
          {isMounted && isLogin && <WriteButton />}
        </div>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px] pt-[10px]">
        {blogList && blogList.length > 0 ? (
          blogList.map((blog) => <BlogItem key={blog.id} data={blog} />)
        ) : (
          <p className="mt-8 text-black-888">작성한 블로그 글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default BlogListScreen;
