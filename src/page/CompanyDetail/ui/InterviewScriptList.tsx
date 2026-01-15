import { InterviewListType } from "entities/interview";

type InterviewScriptListProps = {
  interviewList: InterviewListType;
};

export const InterviewScriptList = ({
  interviewList,
}: InterviewScriptListProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        회사 면접 스크립트
      </h2>
      {interviewList.length > 0 ? (
        <ul className="space-y-2">
          {interviewList.map((interview, idx) => (
            <li key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
              스크립트 {idx + 1}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">
          등록된 면접 스크립트가 없습니다.
        </p>
      )}
    </div>
  );
};
