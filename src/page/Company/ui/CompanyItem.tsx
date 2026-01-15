import { Link } from "i18n/routing";
import { CompanyTableType } from "entities/interview";

type CompanyItemProps = {
  data: Pick<
    CompanyTableType,
    "id" | "name" | "type" | "applied_at" | "status" | "result"
  >;
};

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
          <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
            {data.status}
          </span>
          <span className="text-sm text-gray-600">{data.result}</span>
        </div>
      </Link>
    </li>
  );
};
