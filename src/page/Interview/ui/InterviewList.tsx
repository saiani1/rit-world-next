import { InterviewListType } from "entities/interview/model/type";
import { Link } from "i18n/routing";

type IntervieListProps = {
  data: InterviewListType;
};

export const InterviewList = ({ data }: IntervieListProps) => {
  return (
    <ul className="mt-4 space-y-4">
      {data?.length > 0 ? (
        data.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link
              href={`/interview/${item.id}`}
              className="flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-gray-500">{item.interview_date}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
              </div>
              <div className="flex flex-col items-end">
                <h3 className="text-lg font-bold text-black-555">
                  {item.company_name}
                </h3>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-white bg-blue-100 rounded">
                  {item.interview_type}
                </span>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <li className="text-center py-10 text-gray-500">
          등록된 면접 기록이 없습니다.
        </li>
      )}
    </ul>
  );
};
