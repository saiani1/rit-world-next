import { Link } from "i18n/routing";
import { InterviewSetType } from "entities/interview";

type ExpectedQuestionListProps = {
  questions: InterviewSetType[];
  companyId: string;
  companyName: string;
  isLoading?: boolean;
};

export const ExpectedQuestionList = ({
  questions,
  companyId,
  companyName,
  isLoading,
}: ExpectedQuestionListProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          회사 예상 질문 리스트
        </h2>
        <Link
          href={{
            pathname: "/interview/company/question",
            query: { companyName, companyId },
          }}
          className="px-3 py-1.5 text-sm bg-blue-50/50 text-blue-600 rounded-md transition-colors"
        >
          + 예상 질문 생성
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : questions.length > 0 ? (
        <ul className="space-y-2">
          {questions.map((question) => (
            <li key={question.id}>
              <Link
                href={`/interview/company/question?companyId=${question.company_id}&companyName=${companyName}&id=${question.id}`}
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {question.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {question.updated_at
                    ? new Date(question.updated_at).toLocaleDateString()
                    : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">등록된 예상 질문이 없습니다.</p>
        </div>
      )}
    </div>
  );
};
