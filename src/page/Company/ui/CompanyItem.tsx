import dayjs from "dayjs";
import "dayjs/locale/ko";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { Link } from "i18n/routing";
import { CompanyTableType } from "entities/interview";

type CompanyItemProps = {
  data: Pick<
    CompanyTableType,
    | "id"
    | "name"
    | "type"
    | "applied_at"
    | "status"
    | "result"
    | "history"
    | "next_step_date"
  >;
};

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

export const CompanyItem = ({ data }: CompanyItemProps) => {
  const isRejected =
    (data.history &&
      data.history.length > 0 &&
      data.history[data.history.length - 1].result === "탈락") ||
    ((!data.history || data.history.length === 0) && data.result === "탈락");

  const getBadgeClasses = (
    isRejectedItem: boolean,
    type: "status" | "result",
    entryResult?: string
  ) => {
    if (isRejectedItem) return "bg-gray-100 text-gray-500 border-gray-200";
    if (type === "status")
      return "bg-indigo-50 text-indigo-600 border-indigo-100";
    if (type === "result" && entryResult === "탈락")
      return "bg-red-50 text-red-600 border-red-100";
    if (type === "result") return "bg-gray-50 text-gray-600 border-gray-200";
    return "";
  };

  return (
    <li
      key={data.id}
      className={`rounded-xl shadow-sm border border-gray-100 ${
        isRejected
          ? "bg-gray-100 cursor-not-allowed"
          : "bg-white hover:shadow-md transition-shadow"
      }`}
    >
      <Link
        href={`company/${data.id}`}
        className="flex justify-between items-center p-6 w-full h-full"
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${isRejected ? "bg-gray-50 text-gray-400" : "bg-gray-100 text-gray-600"}`}
            >
              {data.type}
            </span>
            <h3
              className={`text-lg font-bold ${isRejected ? "text-gray-500" : "text-gray-900"}`}
            >
              {data.name}
            </h3>
          </div>
          {(!data.history || data.history.length === 0) && (
            <p
              className={`text-sm ${isRejected ? "text-gray-400" : "text-gray-500"}`}
            >
              지원일: {new Date(data.applied_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {data.history && data.history.length > 0 ? (
            <div className="flex items-center flex-wrap justify-end gap-x-2 gap-y-1">
              {data.history.map((entry, index) => (
                <div
                  key={`history-entry-${index}`}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-1 text-sm">
                    <span
                      className={`${isRejected ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {dayjs(entry.date).format("MM.DD")}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getBadgeClasses(isRejected, "status")}`}
                    >
                      {entry.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getBadgeClasses(isRejected, "result", entry.result)}`}
                    >
                      {entry.result}
                    </span>
                  </div>
                  {index < data.history.length - 1 && (
                    <span
                      className={`text-gray-400 ${isRejected ? "text-gray-300" : ""}`}
                    >
                      &gt;
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 text-sm">
                {data.status && (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getBadgeClasses(isRejected, "status")}`}
                  >
                    {data.status}
                  </span>
                )}
                {data.result && (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getBadgeClasses(isRejected, "result", data.result)}`}
                  >
                    {data.result}
                  </span>
                )}
              </div>
              {!isRejected && data.next_step_date && (
                <div className="text-sm text-gray-600 text-right mt-1">
                  <span>
                    {dayjs.utc(data.next_step_date).format("YYYY-MM-DD HH:mm")}{" "}
                    예정
                  </span>
                </div>
              )}
              {!isRejected &&
                !data.status &&
                !data.result &&
                !data.next_step_date && (
                  <span className="text-gray-400 text-sm">정보 없음</span>
                )}
            </>
          )}
        </div>
      </Link>
    </li>
  );
};
