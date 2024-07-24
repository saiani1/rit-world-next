import {
  BlogItem,
  BigBlogItem,
  FilterButton,
  Title,
  WriteButton,
} from "shared/index";

export const NewBlogListScreen = () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-[15px] mb-[10px]">
        <Title name="최신 포스트" />
        <div className="flex gap-x-[13px]">
          <WriteButton />
          <FilterButton />
        </div>
      </div>
      <ul className="flex flex-wrap justify-between gap-y-[40px]">
        <li>
          <BigBlogItem />
        </li>
        <li>
          <ul className="flex flex-col gap-y-[25px]">
            <BlogItem direction="row" />
            <BlogItem direction="row" />
            <BlogItem direction="row" />
          </ul>
        </li>
      </ul>
    </div>
  );
};
