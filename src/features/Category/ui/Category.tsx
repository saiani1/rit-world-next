"use client";
import { useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiSubdirectoryRight } from "react-icons/bi";

import { Link } from "i18n/routing";
import { CategoryType } from "entities/category";
import { CategoryListAtom } from "../model";
import { useEffect, useMemo } from "react";

type CategoryProps = {
  data: CategoryType[];
};

export const Category = ({ data }: CategoryProps) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const setCategoryList = useSetAtom(CategoryListAtom);
  const { topLevelCategories, childCategoriesMap } = useMemo(() => {
    const topLevelCategories: CategoryType[] = [];
    const childCategoriesMap = new Map<string, CategoryType[]>();

    data.forEach((category) => {
      if (category.parent_id === null) {
        topLevelCategories.push(category);
      } else {
        const children = childCategoriesMap.get(category.parent_id) || [];
        children.push(category);
        childCategoriesMap.set(category.parent_id, children);
      }
    });

    return { topLevelCategories, childCategoriesMap };
  }, [data]);

  useEffect(() => {
    setCategoryList(data);
  }, [data]);

  return (
    <nav className="relative flex flex-col grow mt-[10px] py-[20px] px-[32px] w-[250px] bg-white rounded-xl">
      <p className="pb-[4px] mb-[20px] text-black-888 text-[12px] border-b">
        CATEGORY
      </p>
      <ul className="flex flex-col gap-y-2">
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
            <ul className="flex flex-col gap-y-1">
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
    </nav>
  );
};
