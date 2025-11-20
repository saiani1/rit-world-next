"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";

import ArrowIcon from "public/assets/svg/top-arrow-icon.svg";
import { BlogItem, WriteButton } from "features/Blog";
import { Category, CategoryListAtom } from "features/Category";
import { isLoginAtom } from "entities/user";
import { CategoryType } from "entities/category";
import { BlogJpType, BlogType } from "entities/blog";
import { CommonButton, Title } from "shared/ui";
import { getDisplayLabelAndTitle } from "../lib/getDisplayLabelAndTitle";
import { SearchBox } from "widgets/Header/ui/SearchBox";

type BlogListScreenProps = {
  data: BlogType[] | BlogJpType[];
  categoryData: CategoryType[];
};

const BlogListScreen = ({ data, categoryData }: BlogListScreenProps) => {
  const t = useTranslations("BlogList");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const keyword = searchParams?.get("keyword");
  const hashtag = searchParams?.get("hashtag");
  const isLogin = useAtomValue(isLoginAtom);
  const categoryList = useAtomValue(CategoryListAtom);
  const [isMounted, setIsMounted] = useState(false);
  const [toggleCategory, setToggleCategory] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { blogList, categoryTitle, categoryNoticeKo, categoryNoticeJp } =
    useMemo(() => {
      if (!isMounted) {
        const publicData = data.filter((blog) => blog.is_private !== true);
        return { blogList: publicData, categoryTitle: t("title") };
      }
      let filteredData: (BlogType | BlogJpType)[] = data;
      if (!isLogin) {
        filteredData = filteredData.filter((blog) => blog.is_private !== true);
      }

      if (categoryId) {
        filteredData = filteredData.filter(
          (blog) =>
            blog.large_category_id === categoryId ||
            blog.middle_category_id === categoryId
        );
      }

      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        filteredData = filteredData.filter((blog) => {
          const subject = blog.subject?.toLowerCase() || "";
          const content = blog.content?.toLowerCase() || "";

          return (
            subject.includes(lowerKeyword) || content.includes(lowerKeyword)
          );
        });
      }

      if (hashtag) {
        filteredData = filteredData.filter((blog) =>
          blog.blog_hashtag.some((h) => h.hashtag_id.name === hashtag)
        );
      }

      const currentCategory = categoryList?.find(
        (cate) => cate.id === categoryId
      );

      return {
        blogList: filteredData,
        categoryTitle: currentCategory?.title || t("noCategory"),
        categoryNoticeKo: currentCategory?.notice_ko,
        categoryNoticeJp: currentCategory?.notice_jp,
      };
    }, [
      categoryId,
      data,
      categoryList,
      isLogin,
      t,
      isMounted,
      keyword,
      hashtag,
    ]);

  const { label, value } = getDisplayLabelAndTitle({
    t,
    categoryId,
    keyword,
    hashtag,
    categoryTitle,
  });

  return (
    <div className="mx-[20px] sm:mx-0">
      <div className="flex flex-col justify-between items-baseline gap-y-1 pb-[15px] mb-[20px] border-b">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-baseline gap-x-[5px]">
            {label && (
              <span className="text-black-777 text-[17px]">{label} :</span>
            )}
            <Title name={value} />
            <span className="inline-block transform -translate-y-[2px] text-black-999 text-[14px]">
              ({blogList.length})
            </span>
          </div>
          <div className="flex gap-x-[13px]">
            {isMounted && isLogin && locale === "ko" && <WriteButton />}
          </div>
        </div>
        {categoryNoticeKo && (
          <div className="pl-2 py-2 w-full bg-gradient-to-r from-[#FF4E50]/80 via-[#FC913A]/80 to-[#F9D423]/80 rounded-md">
            <p className="text-[13px] text-white">
              {locale === "ko" ? categoryNoticeKo : categoryNoticeJp}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full sm:hidden">
        <div className="flex justify-between items-center gap-x-2 w-full">
          <CommonButton
            className="flex justify-between items-center px-[14px] py-[6px] w-full border border-black-CCC rounded-md"
            onClick={() => setToggleCategory((prev) => !prev)}
          >
            <span className="text-black-888">{t("category")}</span>
            <ArrowIcon
              className={`w-[10px] text-black-AAA transition-transform duration-200 ${toggleCategory ? "" : "rotate-180"}`}
            />
          </CommonButton>
          <SearchBox isMobile setToggleCategory={setToggleCategory} />
        </div>
        <AnimatePresence>
          {toggleCategory && (
            <motion.div
              className="border-b"
              key="mobile-category"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Category
                isMobile
                setMobileToggle={setToggleCategory}
                data={categoryData}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
