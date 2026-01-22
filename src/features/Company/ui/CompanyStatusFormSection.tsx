import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

import {
  CompanyTableType,
  INTERVIEW_STATUS_TYPES,
  INTERVIEW_RESULT_TYPES,
} from "entities/interview";
import { CommonInput } from "shared/ui";

type CompanyStatusFormSectionProps = {
  register: UseFormRegister<CompanyTableType>;
  watch: UseFormWatch<CompanyTableType>;
  setValue: UseFormSetValue<CompanyTableType>;
  isUndecided: boolean;
  setIsUndecided: (value: boolean) => void;
};

export const CompanyStatusFormSection = ({
  register,
  watch,
  setValue,
  isUndecided,
  setIsUndecided,
}: CompanyStatusFormSectionProps) => {
  const nextStepDate = watch("next_step_date");

  const handleUndecidedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUndecided(e.target.checked);
    if (e.target.checked) {
      setValue("next_step_date", "");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          현재 전형 단계
        </label>
        <select
          {...register("status")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {INTERVIEW_STATUS_TYPES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          결과
        </label>
        <select
          {...register("result")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {INTERVIEW_RESULT_TYPES.map((result) => (
            <option key={result} value={result}>
              {result}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          다음 전형 일정
        </label>
        <div className="flex items-center gap-3">
          <input
            type="datetime-local"
            {...register("next_step_date")}
            disabled={isUndecided}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isUndecided}
              onChange={handleUndecidedChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            미정
          </label>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          화상 면접 링크
        </label>
        <CommonInput
          {...register("meeting_url")}
          disabled={isUndecided || !nextStepDate}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          placeholder="면접 링크를 입력하세요 (Zoom, Google Meet 등)"
        />
      </div>
    </div>
  );
};
