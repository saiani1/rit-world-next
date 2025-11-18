"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { FaSearch } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

import { CommonButton, CommonInput } from "shared/ui";
import { searchTextAtom } from "../model";

export const SearchBox = () => {
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
  };

  return (
    <AnimatePresence>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ width: 29.5 }}
        animate={{ width: isClickSearchBox ? 200 : 29.5 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`relative flex ${isClickSearchBox ? "pr-[15px]" : ""} ml-[10px] min-w-[29.5px] h-[29.5px] border border-black-CCC rounded-full`}
      >
        <CommonButton
          type="submit"
          className={`flex items-center ${isClickSearchBox ? "ml-2" : "justify-center"} w-full h-full`}
          onClick={() => setIsClickSearchBox((prev) => !prev)}
        >
          <FaSearch size={14} fill="#666" />
        </CommonButton>
        {isClickSearchBox && (
          <CommonInput
            className="pl-[5px] bg-transparent text-[14px]"
            value={searchText}
            onChange={handleChangeText}
          />
        )}
      </motion.form>
    </AnimatePresence>
  );
};
