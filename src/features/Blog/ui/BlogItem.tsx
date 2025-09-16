"use client";
import Image from "next/image";
import dayjs from "dayjs";

import { Link } from "i18n/routing";
import { BlogType, BlogJpType } from "entities/blog";
import { Hashtag } from "shared/ui";

type BlogItemType = {
  data: BlogType | BlogJpType;
};

export const BlogItem = ({ data }: BlogItemType) => {
  return (
    <li className="w-full sm:w-[250px] xl:w-[350px]">
      <Link
        href={`/post/${data.path}`}
        className="flex flex-col items-start h-full text-left rounded-[5px] shadow-md shadow-black-EE overflow-hidden"
      >
        <div className="w-full h-[200px] sm:h-[150px] xl:h-[220px] relative overflow-hidden bg-black-888">
          <Image
            src={data.thumbnail}
            style={{ objectFit: "cover", objectPosition: "top" }}
            fill
            alt={data.subject}
          />
        </div>
        <div className="px-4 py-6 w-full bg-white">
          <span className="mb-[8px] inline-block text-[13px] text-black-888">
            {dayjs(data.create_at).format("YYYY.MM.DD")}
          </span>
          <p className="mb-[6px] text-[19px] leading-6 text-black-444 font-semibold truncate">
            {data.subject}
          </p>
          <span className="block text-[13px] leading-5 text-black-777 truncate">
            {data.summary}
          </span>
          <ul className="flex gap-x-[3px] gap-y-[4px] mt-[15px] w-full flex-wrap">
            {data.blog_hashtag?.map((hash) => (
              <Hashtag key={hash.hashtag_id.id} name={hash.hashtag_id.name} />
            ))}
          </ul>
        </div>
      </Link>
    </li>
  );
};
