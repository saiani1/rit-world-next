import { useState } from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { HiPencil, HiCheck } from "react-icons/hi2";
import { CommonButton } from "shared/ui";
import { InterviewType } from "entities/interview";

type InterviewInfoProps = {
  data: InterviewType;
  register: UseFormRegister<InterviewType>;
  watch: UseFormWatch<InterviewType>;
  isDirty: boolean;
  onSave: () => void;
};

export const InterviewInfo = ({
  data,
  register,
  watch,
  isDirty,
  onSave,
}: InterviewInfoProps) => {
  const [editingState, setEditingState] = useState<Record<string, boolean>>({});

  const toggleEdit = (key: string) => {
    setEditingState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const companyName = watch("company_name");
  const interviewType = watch("interview_type");

  return (
    <section className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Interview Info</h2>
        {isDirty && (
          <CommonButton
            onClick={onSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Changes
          </CommonButton>
        )}
      </div>
      <div className="grid gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-gray-700">
            Company Name
          </label>
          <div className="flex items-center gap-2">
            {editingState["company_name"] ? (
              <input
                {...register("company_name")}
                className="border p-2 rounded"
              />
            ) : (
              <p>{companyName}</p>
            )}
            <CommonButton onClick={() => toggleEdit("company_name")}>
              {editingState["company_name"] ? (
                <HiCheck className="w-5 h-5 text-green-600" />
              ) : (
                <HiPencil className="w-4 h-4 text-gray-500" />
              )}
            </CommonButton>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-gray-700">
            Interview Type
          </label>
          <div className="flex items-center gap-2">
            {editingState["interview_type"] ? (
              <input
                {...register("interview_type")}
                className="border p-2 rounded"
              />
            ) : (
              <p>{interviewType}</p>
            )}
            <button onClick={() => toggleEdit("interview_type")}>
              {editingState["interview_type"] ? (
                <HiCheck className="w-5 h-5 text-green-600" />
              ) : (
                <HiPencil className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date: </span>
          <span suppressHydrationWarning>
            {new Date(data.interview_date).toLocaleDateString("ko-KR")}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Summary: </span>
          <p className="mt-1 text-gray-600">{data.summary}</p>
        </div>
      </div>
    </section>
  );
};
