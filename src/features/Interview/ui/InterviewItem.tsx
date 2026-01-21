"use client";
import { useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";

import { Link, useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { deleteInterview, InterviewListType } from "entities/interview";
import { CommonButton } from "shared/ui";

type InterviewItemProps = {
  item: InterviewListType[number];
  companyPage?: boolean;
};

export const InterviewItem = ({ item, companyPage }: InterviewItemProps) => {
  const router = useRouter();
  const setModal = useSetAtom(ModalAtom);
  return (
    <li
      className={`flex justify-between bg-white ${companyPage ? "border" : "shadow-md"}  rounded-lg transition-colors group hover:bg-gray-50 cursor-pointer`}
    >
      <Link
        href={`/interview/record/${item.id}`}
        className="flex justify-between items-start p-4 w-full"
      >
        <div>
          <p className="text-sm text-gray-500">{item.interview_date}</p>
          <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h3 className="text-lg font-bold text-black-555">
            {item.company_name}
          </h3>
          <div className="flex items-center gap-1">
            {item.company_type && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-gray-400 rounded">
                {item.company_type}
              </span>
            )}
            <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-blue-100 rounded">
              {item.interview_type}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};
