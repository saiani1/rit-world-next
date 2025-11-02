"use client";
import Image from "next/image";
import dayjs from "dayjs";
import { RiLock2Fill } from "react-icons/ri";

import { Link } from "i18n/routing";
import { BlogType, BlogJpType } from "entities/blog";
import { Hashtag } from "shared/ui";
import defalutImg from "public/assets/image/default-image.jpg";

type BlogItemType = {
  data: BlogType | BlogJpType;
};

export const BlogItem = ({ data }: BlogItemType) => {
  return (
    <li className="flex flex-col items-start h-full text-left overflow-hidden">
      <Link
        href={`/post/${data.path}`}
        className="w-full aspect-[1200/750] relative overflow-hidden bg-black-888 rounded-md"
      >
        <Image
          src={data.thumbnail || defalutImg}
          style={{ objectFit: "cover", objectPosition: "top" }}
          fill
          alt={data.subject}
        />
        {data.is_private && (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center w-[90px] h-[90px] bg-white/85 rounded-full pointer-events-none">
            <RiLock2Fill size={50} className="text-black-666/80" />
          </div>
        )}
        <span className="absolute top-2 left-2 px-2 text-[12px] text-black-888 bg-white rounded-sm pointer-events-none">
          {`${data.category_large.title} < ${data.category_middle.title}`}
        </span>
      </Link>
      <div className="w-full">
        <span className="mt-[8px] mb-[10px] inline-block text-[13px] text-black-999 tracking-normal">
          {dayjs(data.create_at).format("YYYY.MM.DD")}
        </span>
        <Link
          href={`/post/${data.path}`}
          className="mb-[6px] text-[18px] leading-[1.6rem] text-black-444 font-medium line-clamp-2"
        >
          {data.subject}
        </Link>
        <span className="block text-[14px] leading-[1.3rem] text-black-777 line-clamp-2">
          {data.summary}
        </span>
        <ul className="flex gap-x-[4px] gap-y-[4px] mt-[15px] w-full flex-wrap">
          {data.blog_hashtag?.map((hash) => (
            <Hashtag key={hash.hashtag_id.id} name={hash.hashtag_id.name} />
          ))}
        </ul>
      </div>
    </li>
  );
};
