"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { AnimatePresence, motion } from "motion/react";

import { CommonButton, CommonInput } from "shared/ui";
import { searchTextAtom } from "../model";

type SearchBoxType = {
  isMobile?: boolean;
  setToggleCategory?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchBox = ({ isMobile, setToggleCategory }: SearchBoxType) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClickSearchBox, setIsClickSearchBox] = useState<boolean>(false);
  const [searchText, setSearchText] = useAtom(searchTextAtom);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchText) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", searchText);
    params.delete("category");

    router.push(`/?${params.toString()}`);
    setSearchText("");
    setToggleCategory && setToggleCategory(false);
  };

  return (
    <AnimatePresence>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ width: 29.5 }}
        animate={{ width: isClickSearchBox ? 200 : 29.5 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`relative flex ${isClickSearchBox ? "pr-[15px]" : ""} ${isMobile ? "min-w-[38px] w-full h-[38px]" : "ml-[10px] min-w-[29.5px] h-[29.5px]"} border border-black-CCC rounded-full`}
      >
        <CommonButton
          type="submit"
          className={`flex items-center ${isClickSearchBox ? "ml-2" : "justify-center"} w-[36px] h-full`}
          onClick={() => setIsClickSearchBox((prev) => !prev)}
        >
          {isClickSearchBox ? (
            <FaCheck size={14} fill="#666" />
          ) : (
            <FaSearch size={14} fill="#666" />
          )}
        </CommonButton>
        {isClickSearchBox && (
          <CommonInput
            className="w-full bg-transparent text-[14px]"
            value={searchText}
            onChange={handleChangeText}
          />
        )}
      </motion.form>
    </AnimatePresence>
  );
};
