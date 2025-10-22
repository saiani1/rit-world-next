"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiSubdirectoryRight } from "react-icons/bi";

import { Link, usePathname } from "i18n/routing";
import { CategoryType } from "entities/category";
import { useIsEditMode } from "shared/index";
import { CategoryListAtom, isClickMobileMenuAtom } from "../model";
import { filteredCategory } from "../util";

type CategoryProps = {
  data: CategoryType[];
  isMobile?: boolean;
};

export const Category = ({ data, isMobile }: CategoryProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const setCategoryList = useSetAtom(CategoryListAtom);
  const setIsClickMenu = useSetAtom(isClickMobileMenuAtom);
  const isEditMode = useIsEditMode();
  const { topLevelCategories, childCategoriesMap } = useMemo(
    () => filteredCategory(data),
    [data]
  );

  useEffect(() => {
    setCategoryList(data);
  }, [data]);

  return (
    <AnimatePresence>
      {!isEditMode && (
        <motion.nav
          key="category"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative flex flex-col mt-[10px] py-[30px] ${isMobile ? "" : "px-[32px] w-[250px] bg-black-10"} rounded-xl`}
        >
          <p
            className={`${isMobile ? "hidden" : ""} pb-[4px] mb-[20px] text-black-888 text-[12px] border-b`}
          >
            CATEGORY
          </p>
          <ul
            className={`flex flex-col ${isMobile ? "gap-y-4" : "gap-y-2"}`}
            onClick={() => setIsClickMenu(false)}
          >
            <li>
              <Link
                href={{ pathname: "/" }}
                className={`flex items-center gap-x-2 ${!categoryId ? "text-purple-100 font-medium" : "text-black-777 font-normal"}`}
              >
                <IoDocumentTextOutline size={16} />
                <span>All</span>
              </Link>
            </li>
            {topLevelCategories.map((cate) => (
              <li key={cate.id} className="flex flex-col gap-y-1">
                <Link
                  href={{ pathname: "/", query: { category: cate.id } }}
                  className={`flex items-center gap-x-2 ${categoryId === cate.id ? "text-purple-100 font-medium" : "text-black-777 font-normal"}`}
                >
                  <IoDocumentTextOutline size={16} />
                  <span>{cate.title}</span>
                </Link>
                <ul
                  className={`flex flex-col ${isMobile ? "gap-y-2" : "gap-y-1"}`}
                >
                  {childCategoriesMap.get(cate.id)?.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={{ pathname: "/", query: { category: item.id } }}
                        className={`flex items-center gap-x-2 ml-2 ${categoryId === item.id ? "text-purple-100 font-medium" : "text-black-777 font-normal"}`}
                      >
                        <BiSubdirectoryRight />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
