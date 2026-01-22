import { CommonButton } from "shared/ui";

type ExpectedQuestionListProps = {
  questions: any[];
  onCreate: () => void;
};

export const ExpectedQuestionList = ({
  questions,
  onCreate,
}: ExpectedQuestionListProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          회사 예상 질문 리스트
        </h2>
        <CommonButton
          onClick={onCreate}
          className="px-3 py-1.5 text-sm bg-blue-50/50 text-blue-600 rounded-md transition-colors"
        >
          + 예상 질문 생성
        </CommonButton>
      </div>
      {questions.length > 0 ? (
        <ul className="space-y-2">
          {questions.map((question, idx) => (
            <li key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
              {/* Question Item Content */}
              질문 {idx + 1}
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
