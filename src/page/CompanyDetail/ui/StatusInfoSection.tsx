import { UseFormRegister, UseFormWatch } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ReadOnlyField, SectionHeader } from "features/Company";
import {
  CompanyTableType,
  INTERVIEW_STATUS_TYPES,
  INTERVIEW_RESULT_TYPES,
} from "entities/interview";
import { CommonInput } from "shared/ui";

dayjs.extend(utc);
type StatusInfoSectionProps = {
  register: UseFormRegister<CompanyTableType>;
  watch: UseFormWatch<CompanyTableType>;
  isSubmitting: boolean;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
  isUndecided: boolean;
  onUndecidedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyData: CompanyTableType;
};

export const StatusInfoSection = ({
  register,
  watch,
  isSubmitting,
  editingSection,
  setEditingSection,
  onSave,
  onCancel,
  isUndecided,
  onUndecidedChange,
  companyData,
}: StatusInfoSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <SectionHeader
        title="전형 현황"
        sectionName="status"
        editingSection={editingSection}
        isSubmitting={isSubmitting}
        setEditingSection={setEditingSection}
        handleCancel={onCancel}
        onSave={onSave}
      />
      {editingSection === "status" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 전형 단계
            </label>
            <select
              {...register("status")}
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
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
                className="p-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUndecided}
                  onChange={onUndecidedChange}
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
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="현재 전형 단계" value={watch("status")} />
          <ReadOnlyField label="결과" value={watch("result")} />
          <div className="md:col-span-2">
            <ReadOnlyField
              label="다음 전형 일정"
              value={
                isUndecided
                  ? "미정"
                  : watch("next_step_date")
                    ? new Date(watch("next_step_date")!).toLocaleString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        }
                      )
                    : "-"
              }
            />
          </div>
          <div className="md:col-span-2">
            <ReadOnlyField
              label="화상 면접 링크"
              value={watch("meeting_url")}
              isLink
            />
          </div>

          {companyData?.history && companyData.history.length > 0 && (
            <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                전형 이력
              </h4>
              <ul className="space-y-2">
                {companyData.history.map((entry, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="font-medium text-gray-500 w-24">
                      {dayjs(entry.date).format("YYYY.MM.DD")}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs">
                      {entry.status}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">
                      {entry.result}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
