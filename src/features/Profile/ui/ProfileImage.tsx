"use client";
import Image from "next/image";

type ProfileImageType = {
  imgSrc: string;
};

export const ProfileImage = ({ imgSrc }: ProfileImageType) => {
  return (
    <div className="relative flex flex-col">
      <div className="h-[130px] bg-[#eee] rounded-t-xl overflow-hidden">
        <Image
          src={imgSrc}
          width={250}
          height={250}
          alt="dimmed"
          className="blur-sm"
        />
      </div>
      <div className="absolute top-[60px] left-[50%] translate-x-[-50%] w-[134px] h-[134px] bg-[#aaa] overflow-hidden rounded-[50%] border-[6px] border-white shadow-profileShadow">
        <Image
          src={imgSrc}
          width={134}
          height={134}
          className=""
          alt="프로필사진"
        />
      </div>
    </div>
  );
};
