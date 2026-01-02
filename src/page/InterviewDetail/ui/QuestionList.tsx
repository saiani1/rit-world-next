import { useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { HiChevronDown } from "react-icons/hi2";

import { InterviewType } from "entities/interview";
import { CommonButton } from "shared/ui";

type QuestionListProps = {
  fields: any[];
  watch: UseFormWatch<InterviewType>;
  onScrollToQuestion: (index: number) => void;
};

export const QuestionList = ({
  fields,
  watch,
  onScrollToQuestion,
}: QuestionListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden w-full max-w-full">
      <CommonButton
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center p-4 w-full text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold">Question List</h2>
        <HiChevronDown
          className={`w-6 h-6 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CommonButton>
      {isOpen && (
        <div className="p-4 border-t bg-gray-50 flex flex-col gap-2 w-full">
          {fields.map((field, index) => {
            const question = watch(`qa_data.${index}.question_ko`);
            const type = watch(`qa_data.${index}.question_type`);
            return (
              <CommonButton
                key={field.id}
                onClick={() => onScrollToQuestion(index)}
                className="text-left text-sm text-gray-700 hover:text-blue-600 hover:underline w-full min-w-0"
              >
                <span
                  className={`inline-block mr-2 font-bold ${
                    type === "역질문" ? "text-yellow-600" : "text-blue-600"
                  }`}
                >
                  [{type || "면접관"}]
                </span>
                {index + 1}. {question}
              </CommonButton>
            );
          })}
        </div>
      )}
    </section>
  );
};
