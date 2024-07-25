"use client";
import { filterAtom } from "entities/blog/model/atom";
import { useAtomValue } from "jotai";
import { AllBlogListScreen, NewBlogListScreen } from "pages/BlogList";

const HomePage = () => {
  const filterName = useAtomValue(filterAtom);

  return (
    <>{filterName === "all" ? <AllBlogListScreen /> : <NewBlogListScreen />}</>
  );
};

export default HomePage;
