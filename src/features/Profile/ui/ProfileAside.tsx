"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ImAttachment } from "react-icons/im";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import toast from "react-hot-toast";

import GithubIcon from "public/assets/svg/github-icon.svg";
import { ProfileType } from "entities/user";
import { Tooltip, useOnClickOutside } from "shared/index";
import { ProfileImage } from "./ProfileImage";

type ProfileAsideType = {
  data: ProfileType;
};

export const ProfileAside = ({ data }: ProfileAsideType) => {
  const tooltipRef = useRef(null);
  const [isEmailClick, setIsEmailClick] = useState(false);

  const handleEmailBtnClick = () => {
    setIsEmailClick((prev) => !prev);
  };

  const handleBtnClick = () => {
    navigator.clipboard
      .writeText(data.email!)
      .then(() => {
        toast.success("이메일 주소가 복사되었습니다.");
      })
      .catch((err) => {
        toast.error("복사 실패, 다시 시도해주세요.");
      });
  };

  useOnClickOutside(tooltipRef, () => setIsEmailClick(false));

  return (
    <aside className="flex flex-col gap-y-2 justify-between w-[250px] h-[410px] bg-white rounded-xl">
      <ProfileImage imgSrc={data.imgUrl} />
      <div className="px-[29px] pb-[12px]">
        <div className="flex justify-center items-center mb-[10px] h-[70px] overflow-auto">
          <p className="text-[14px] text-[#666] text-center">
            {data.introduce}
          </p>
        </div>
        <div className="flex items-baseline gap-x-[10px] border-b-[1px] border-[#ddd]">
          <h2 className="font-semibold text-[22px] text-[#444]">{data.name}</h2>
          <span className="text-[12px] text-[#888]">{data.job}</span>
        </div>
        <dl className="flex items-center gap-x-[5px]">
          <dt>
            <FaLocationDot size={15} className="pt-[2px] fill-[#555]" />
          </dt>
          <dd>
            <span className="text-[#555] text-[12px]">{data.location}</span>
          </dd>
        </dl>
        <ul className="flex items-center mt-[16px] gap-x-[8px]">
          {data.portfolio && (
            <li>
              <Link
                href={data.portfolio}
                aria-label="포트폴리오"
                title="포트폴리오"
              >
                <ImAttachment size={24} />
              </Link>
            </li>
          )}
          {data.email && (
            <li ref={tooltipRef} className="relative h-[24px]">
              <button
                type="button"
                onClick={handleEmailBtnClick}
                aria-label="이메일"
                title="이메일"
              >
                <MdOutlineAlternateEmail size={24} />
              </button>
              {isEmailClick && (
                <Tooltip text={data.email} hasButton onClick={handleBtnClick} />
              )}
            </li>
          )}
          {data.linkedinUrl && (
            <li>
              <Link
                href={data.linkedinUrl}
                target="_blank"
                aria-label="링크드인"
                title="링크드인"
              >
                <FaLinkedin size={24} />
              </Link>
            </li>
          )}
          {data.gitHubUrl && (
            <li>
              <Link
                href={data.gitHubUrl}
                target="_blank"
                aria-label="깃허브"
                title="깃허브"
              >
                <GithubIcon className="w-[24px] fill-[#888]" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
