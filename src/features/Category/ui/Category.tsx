"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { BiSubdirectoryRight } from "react-icons/bi";

import { CategoryType } from "entities/category";
import { CategoryListAtom } from "../model";
import { useEffect } from "react";

type CategoryComType = {
  data: CategoryType[];
};

export const Category = ({ data }: CategoryComType) => {
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("category");
  const setCategoryList = useSetAtom(CategoryListAtom);

  useEffect(() => {
    setCategoryList(data);
  }, [data, setCategoryList]);

  return (
    <nav className="relative flex flex-col grow mt-[10px] py-[20px] px-[32px] w-[250px] bg-white rounded-xl">
      <p className="pb-[4px] mb-[20px] text-[#888] text-[12px] border-b">
        CATEGORY
      </p>
      <ul className="flex flex-col gap-y-2">
        <li>
          <Link
            href={{ pathname: "/" }}
            className={`flex items-center gap-x-2 ${!categoryId ? "text-purple-100 font-medium" : "text-black-777 font-regular"}`}
          >
            <IoDocumentTextOutline size={16} />
            <span>All</span>
          </Link>
        </li>
        {data?.map((cate) => {
          if (cate.parent_id === null)
            return (
              <li key={cate.id} className="flex flex-col gap-y-1">
                <Link
                  href={{ pathname: "/", query: { category: cate.id } }}
                  className={`flex items-center gap-x-2 ${categoryId === cate.id ? "text-purple-100 font-medium" : "text-black-777 font-regular"}`}
                >
                  <IoDocumentTextOutline size={16} />
                  <span>{cate.title}</span>
                </Link>
                <ul className="flex flex-col gap-y-1">
                  {data
                    .filter((item) => item.parent_id === cate.id)
                    .map((item) => (
                      <li key={item.id}>
                        <Link
                          href={{ pathname: "/", query: { category: item.id } }}
                          className={`flex items-center gap-x-2 ml-2 ${categoryId === item.id ? "text-purple-100 font-medium" : "text-black-777 font-regular"}`}
                        >
                          <BiSubdirectoryRight />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
            );
        })}
      </ul>
    </nav>
  );
};
