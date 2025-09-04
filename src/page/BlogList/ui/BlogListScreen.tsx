"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAtomValue } from "jotai";

import { BlogItem, BlogType, WriteButton } from "features/Blog";
import { CategoryListAtom } from "features/Category";
import { isLoginAtom } from "entities/user";
import { Title } from "shared/ui";

type BlogListScreenProps = {
  data: BlogType[];
};

const BlogListScreen = ({ data }: BlogListScreenProps) => {
  const t = useTranslations("BlogList");
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
      return { blogList: data, categoryTitle: t("title") };
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
      categoryTitle: currentCategory?.title || t("noCategory"),
    };
  }, [categoryId, data, categoryList]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[20px] border-b">
        <div className="flex items-baseline gap-x-[5px]">
          {categoryId && (
            <span className="text-black-777 text-[17px]">{`${t("category")} :`}</span>
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
          <p className="text-black-999">{t("noBlog")}</p>
        )}
      </ul>
    </div>
  );
};

export default BlogListScreen;
