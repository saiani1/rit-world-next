"use client";
import { Link } from "i18n/routing";
import { InterviewListType } from "entities/interview";

type InterviewItemProps = {
  item: InterviewListType[number];
  companyPage?: boolean;
};

export const InterviewItem = ({ item, companyPage }: InterviewItemProps) => {
  return (
    <li
      className={`flex justify-between bg-white ${companyPage ? "border" : "shadow-md"}  rounded-lg transition-colors group hover:bg-gray-50 cursor-pointer`}
    >
      <Link
        href={`/interview/record/${item.id}`}
        className={`flex justify-between items-start gap-4 p-4 w-full min-h-[80px] transition-all ${
          !item.company_name ||
          item.status === "pending" ||
          item.status === "processing"
            ? "opacity-80 bg-gray-100/50 animate-pulse cursor-wait"
            : ""
        }`}
      >
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-500">
            {item.interview_date || "날짜 분석 중..."}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {item.duration || "시간 계산 중..."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-1 min-w-0">
          <h3
            className={`text-lg font-bold text-black-555 truncate w-full text-right ${
              !item.company_name ||
              item.status === "pending" ||
              item.status === "processing"
                ? "text-gray-400 font-medium"
                : ""
            }`}
          >
            {item.company_name || "회사를 분석하고 있습니다..."}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            {!item.company_name ||
            item.status === "pending" ||
            item.status === "processing" ? (
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-rose-400 rounded shadow-sm">
                AI 분석 중
              </span>
            ) : (
              <>
                {item.company_type && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-gray-400 rounded">
                    {item.company_type}
                  </span>
                )}
                <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-blue-100 rounded">
                  {item.interview_type || "유형 미정"}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
