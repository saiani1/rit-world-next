import { useState } from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFieldArrayRemove,
} from "react-hook-form";
import { HiPencil, HiCheck, HiXMark } from "react-icons/hi2";

import { InterviewType } from "entities/interview";
import { CommonButton } from "shared/ui";

type QACardProps = {
  index: number;
  register: UseFormRegister<InterviewType>;
  watch: UseFormWatch<InterviewType>;
  remove: UseFieldArrayRemove;
};

export const QACard = ({ index, register, watch, remove }: QACardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const qaItem = watch(`qa_data.${index}`);
  const isReverseQuestion = qaItem?.question_type === "역질문";

  return (
    <div
      id={`question-${index}`}
      className="relative flex flex-col gap-4 p-6 border rounded-lg shadow-sm bg-white group"
    >
      <CommonButton
        onClick={() => remove(index)}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Delete this Q&A"
      >
        <HiXMark className="w-5 h-5" />
      </CommonButton>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold px-2 py-1 rounded ${
            isReverseQuestion
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-white"
          }`}
        >
          {qaItem?.question_type || "면접관"}
        </span>
      </div>

      <div className="flex flex-col gap-1 pr-10">
        <p className="font-bold text-lg">Q. {qaItem?.question_jp}</p>
        <p className="text-sm text-gray-500">{qaItem?.question_ko}</p>
      </div>

      <div className="flex flex-col gap-1 pl-4 border-l-4 border-gray-200">
        <p className="font-medium">A. {qaItem?.answer_jp}</p>
        <p className="text-sm text-gray-500">{qaItem?.answer_ko}</p>
      </div>

      <div className="bg-gray-50 p-3 rounded text-sm">
        <span className="font-bold text-gray-700">Feedback: </span>
        <span>{qaItem?.feedback_ko}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm text-blue-600">
          {isReverseQuestion ? "Recommended Question (JP)" : "Best Answer (JP)"}
        </label>
        <div className="flex items-start gap-2">
          {isEditing ? (
            <textarea
              {...register(`qa_data.${index}.best_answer_jp`)}
              className="border p-2 rounded w-full"
              rows={3}
            />
          ) : (
            <p className="whitespace-pre-wrap flex-1">
              {qaItem?.best_answer_jp}
            </p>
          )}
          <CommonButton
            onClick={() => setIsEditing(!isEditing)}
            className="mt-1"
          >
            {isEditing ? (
              <HiCheck className="w-5 h-5 text-green-600" />
            ) : (
              <HiPencil className="w-4 h-4 text-gray-500" />
            )}
          </CommonButton>
        </div>
      </div>
    </div>
  );
};
