import { InterviewItem } from "features/Interview";
import { InterviewListType } from "entities/interview";

type InterviewScriptListProps = {
  interviewList: InterviewListType;
};

export const InterviewScriptList = ({
  interviewList,
}: InterviewScriptListProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        회사 면접 스크립트
      </h2>
      {interviewList.length > 0 ? (
        <ul className="space-y-2">
          {interviewList.map((interview) => (
            <InterviewItem companyPage item={interview} key={interview.id} />
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
