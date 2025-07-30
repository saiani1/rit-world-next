"use client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

import { Hashtag } from "shared/ui";
import { BlogType } from "../model";

type BlogItemType = {
  data: BlogType;
};

export const BlogItem = ({ data }: BlogItemType) => {
  return (
    <li>
      <Link
        href={data.path}
        className={`flex flex-col items-start w-[250px] text-left`}
      >
        <div className="w-full h-[150px] relative overflow-hidden rounded-[5px]">
          <Image
            src={data.thumbnail}
            style={{ objectFit: "cover", objectPosition: "top" }}
            fill
            alt={data.subject}
          />
        </div>
        <div className="mt-[15px] w-full">
          <span className="mb-[8px] inline-block text-[13px] text-black-888">
            {dayjs(data.create_at).format("YYYY.MM.DD")}
          </span>
          <p className="mb-[6px] text-[19px] leading-6 text-black-444 font-semibold">
            {data.subject}
          </p>
          <span className="text-[13px] leading-5 text-black-777 line-clamp-2">
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
