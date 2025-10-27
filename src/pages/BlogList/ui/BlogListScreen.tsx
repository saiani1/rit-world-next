"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAtomValue } from "jotai";

import { BlogItem, WriteButton } from "features/Blog";
import { CategoryListAtom } from "features/Category";
import { isLoginAtom } from "entities/user";
import { BlogJpType, BlogType } from "entities/blog";
import { Title } from "shared/ui";

type BlogListScreenProps = {
  data: BlogType[] | BlogJpType[];
};

const BlogListScreen = ({ data }: BlogListScreenProps) => {
  const t = useTranslations("BlogList");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const isLogin = useAtomValue(isLoginAtom);
  const categoryList = useAtomValue(CategoryListAtom);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { blogList, categoryTitle } = useMemo(() => {
    if (!isMounted) {
      const publicData = data.filter((blog) => blog.is_private !== true);
      return { blogList: publicData, categoryTitle: t("title") };
    }
    let filteredData: (BlogType | BlogJpType)[] = data;
    if (!isLogin) {
      filteredData = filteredData.filter((blog) => blog.is_private !== true);
    }

    if (!categoryId) {
      return { blogList: filteredData, categoryTitle: t("title") };
    }

    filteredData = filteredData.filter(
      (blog) =>
        blog.large_category_id === categoryId ||
        blog.middle_category_id === categoryId
    );

    const currentCategory = categoryList?.find(
      (cate) => cate.id === categoryId
    );

    return {
      blogList: filteredData,
      categoryTitle: currentCategory?.title || t("noCategory"),
    };
  }, [categoryId, data, categoryList, isLogin, t, isMounted]);

  return (
    <div className="mx-[20px] sm:mx-0">
      <div className="flex justify-between items-center pb-[15px] mb-[20px] border-b">
        <div className="flex items-baseline gap-x-[5px]">
          {categoryId && (
            <span className="text-black-777 text-[17px]">{`${t("category")} :`}</span>
          )}
          <Title name={categoryTitle} />
        </div>
        <div className="flex gap-x-[13px]">
          {isMounted && isLogin && locale === "ko" && <WriteButton />}
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-5 gap-y-10 pt-[10px]">
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
