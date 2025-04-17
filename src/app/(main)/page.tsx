"use client";
import { useAtomValue } from "jotai";

import AllBlogListScreen from "pages/BlogList/ui/AllBlogListScreen";
import NewBlogListScreen from "pages/BlogList/ui/NewBlogListScreen";
import { filterAtom } from "entities/blog";

const HomePage = () => {
  const filterName = useAtomValue(filterAtom);

  return (
    <>{filterName === "all" ? <AllBlogListScreen /> : <NewBlogListScreen />}</>
  );
};

export default HomePage;
