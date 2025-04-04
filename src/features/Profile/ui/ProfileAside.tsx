import { ImAttachment } from "react-icons/im";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

import GithubIcon from "public/assets/svg/github-icon.svg";
import { ProfileImage } from "shared/index";

export const ProfileAside = () => {
  return (
    <aside className="flex flex-col gap-y-2 justify-between overflow-hidden w-[250px] h-[410px] bg-white rounded-xl">
      <ProfileImage />
      <div className="px-[29px] pb-[12px]">
        <div className="flex justify-center mb-[10px] h-[70px] overflow-auto">
          <p className="text-[14px] text-[#666] text-center">
            나에게 당근을 준다면
            <br /> 유혈사태는 일어나지 않을 것입니다.
            <br /> 유혈사태는 일어나지 않을 것입니다.
            <br /> 유혈사태는 일어나지 않을 것입니다.
            <br /> 유혈사태는 일어나지 않을 것입니다.
          </p>
        </div>
        <div className="flex items-baseline gap-x-[10px] border-b-[1px] border-[#ddd]">
          <h2 className="font-semibold text-[22px] text-[#444]">Aibao</h2>
          <span className="text-[12px] text-[#888]">Employee, Everland</span>
        </div>
        <dl className="flex items-center gap-x-[5px]">
          <dt>
            <FaLocationDot size={15} className="pt-[2px] fill-[#555]" />
          </dt>
          <dd>
            <span className="text-[#555] text-[12px]">Yongin, Korea</span>
          </dd>
        </dl>
        <ul className="flex items-center mt-[16px] gap-x-[8px]">
          <li>
            <button type="button" aria-label="포트폴리오" title="포트폴리오">
              <ImAttachment size={24} />
            </button>
          </li>
          <li>
            <button type="button" aria-label="이메일" title="이메일">
              <MdOutlineAlternateEmail size={24} />
            </button>
          </li>
          <li>
            <button type="button" aria-label="링크드인" title="링크드인">
              <FaLinkedin size={24} />
            </button>
          </li>
          <li>
            <button type="button" aria-label="깃허브" title="깃허브">
              <GithubIcon className="w-[24px] fill-[#888]" />
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
