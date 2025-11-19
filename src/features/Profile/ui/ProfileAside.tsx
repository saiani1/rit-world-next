"use client";
import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { ImAttachment } from "react-icons/im";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

import GithubIcon from "public/assets/svg/github-icon.svg";
import { Link } from "i18n/routing";
import { ProfileType } from "entities/user";
import {
  CommonButton,
  Tooltip,
  useIsEditMode,
  useOnClickOutside,
} from "shared/index";
import { ProfileImage } from "./ProfileImage";

type ProfileAsideType = {
  data: ProfileType;
};

export const ProfileAside = ({ data }: ProfileAsideType) => {
  const locale = useLocale();
  const t = useTranslations("Profile");
  const tooltipRef = useRef(null);
  const [isEmailClick, setIsEmailClick] = useState(false);
  const isEditMode = useIsEditMode();

  const handleEmailBtnClick = () => {
    setIsEmailClick((prev) => !prev);
  };

  const handleBtnClick = () => {
    navigator.clipboard
      .writeText(data.email!)
      .then(() => {
        toast.success(t("copySuccess"));
      })
      .catch((err) => {
        toast.error(t("copyFail"));
      });
  };

  useOnClickOutside(tooltipRef, () => setIsEmailClick(false));

  return (
    <AnimatePresence>
      {!isEditMode && (
        <motion.section
          key="profile"
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col gap-y-2 justify-between w-[250px] h-[410px] bg-black-10 rounded-xl"
        >
          <ProfileImage imgSrc={data.imgUrl} />
          <div className="px-[29px] pb-[12px]">
            <div
              className={`flex justify-center items-center ${locale === "ko" ? "mb-[10px]" : "mb-[3px]"} h-[70px] overflow-auto`}
            >
              <p
                className={`${locale === "ko" ? "text-[14px]" : "text-[12px]"} text-black-666 text-center whitespace-pre`}
              >
                {data.introduce}
              </p>
            </div>
            <div
              className={`flex ${locale === "ko" ? "gap-x-[10px]" : "flex-col pb-2"} items-baseline border-b-[1px] border-black-ddd`}
            >
              <h2
                className={`font-semibold ${locale === "ko" ? "text-[22px]" : "text-[20px]"} text-black-444`}
              >
                {data.name}
              </h2>
              <span
                className={`${locale === "ko" ? "text-[12px]" : "text-[11px]"} text-black-888`}
              >
                {data.job}
              </span>
            </div>
            <dl className="flex items-center gap-x-[5px]">
              <dt>
                <FaLocationDot size={15} className="pt-[2px] fill-black-555" />
              </dt>
              <dd>
                <span className="text-black-555 text-[12px]">
                  {data.location}
                </span>
              </dd>
            </dl>
            <ul className="flex items-center mt-[16px] gap-x-[8px]">
              {data.portfolio && (
                <li>
                  <Link
                    href={data.portfolio}
                    aria-label="포트폴리오"
                    title={t("portfolio")}
                  >
                    <ImAttachment size={24} />
                  </Link>
                </li>
              )}
              {data.email && (
                <li ref={tooltipRef} className="relative h-[24px]">
                  <CommonButton
                    onClick={handleEmailBtnClick}
                    aria-label="이메일"
                    title={t("email")}
                  >
                    <MdOutlineAlternateEmail size={24} />
                  </CommonButton>
                  {isEmailClick && (
                    <Tooltip
                      text={data.email}
                      hasButton
                      onClick={handleBtnClick}
                    />
                  )}
                </li>
              )}
              {data.linkedinUrl && (
                <li>
                  <Link
                    href={data.linkedinUrl}
                    target="_blank"
                    aria-label="링크드인"
                    title={t("linkedin")}
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
                    title={t("github")}
                  >
                    <GithubIcon className="w-[24px] fill-black-888" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
