"use client";
import { filterAtom } from "entities/blog/model/atom";
import { useAtomValue } from "jotai";
import AllBlogListScreen from "pages/BlogList/ui/AllBlogListScreen";
import NewBlogListScreen from "pages/BlogList/ui/NewBlogListScreen";

const HomePage = () => {
  const filterName = useAtomValue(filterAtom);

  return (
    <>{filterName === "all" ? <AllBlogListScreen /> : <NewBlogListScreen />}</>
  );
};

export default HomePage;
