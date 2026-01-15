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
    | "next_step_date"
  >;
};

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

export const CompanyItem = ({ data }: CompanyItemProps) => {
  return (
    <li
      key={data.id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <Link
        href={`company/${data.id}`}
        className="flex justify-between items-start p-6 w-full h-full"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
              {data.type}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
          </div>
          <p className="text-sm text-gray-500">
            지원일: {new Date(data.applied_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-x-1">
            <span className="px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
              {data.status}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-600 rounded-md border border-gray-200">
              {data.result}
            </span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            {data.next_step_date ? (
              <span>
                {dayjs(data.next_step_date)
                  .tz("Asia/Seoul")
                  .format("YY.MM.DD(ddd) HH:mm")}{" "}
                예정
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
