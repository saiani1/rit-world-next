import { useState } from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { HiPencil, HiCheck } from "react-icons/hi2";

import {
  InterviewType,
  CompanyTableType,
  INTERVIEW_STATUS_TYPES,
} from "entities/interview";
import { CommonButton } from "shared/ui";

type InterviewInfoProps = {
  data: InterviewType;
  companyList: Pick<
    CompanyTableType,
    "id" | "name" | "type" | "applied_at" | "status" | "result"
  >[];
  register: UseFormRegister<InterviewType>;
  watch: UseFormWatch<InterviewType>;
  setValue: UseFormSetValue<InterviewType>;
  isDirty: boolean;
  onSave: () => void;
};

export const InterviewInfo = ({
  data,
  companyList,
  register,
  watch,
  setValue,
  isDirty,
  onSave,
}: InterviewInfoProps) => {
  const [editingState, setEditingState] = useState<Record<string, boolean>>({});

  const toggleEdit = (key: string) => {
    setEditingState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const companyName = watch("company_name");
  const companyType = watch("company_type");
  const interviewType = watch("interview_type");
  const companyId = watch("company_id");

  const filteredInterviewStatusTypes = INTERVIEW_STATUS_TYPES.filter(
    (type) => type !== "서류전형"
  );

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
              <select
                className="border p-2 rounded"
                value={companyId || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedCompany = companyList.find(
                    (c) => c.id === selectedId
                  );
                  if (selectedCompany) {
                    setValue("company_id", selectedId, { shouldDirty: true });
                    setValue("company_name", selectedCompany.name, {
                      shouldDirty: true,
                    });
                    setValue("company_type", selectedCompany.type, {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <option value="" disabled>
                  Select Company
                </option>
                {companyList
                  .filter(
                    (company) =>
                      company.result !== "탈락" || company.id === companyId
                  )
                  .map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
              </select>
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
            Company Type
          </label>
          <div className="flex items-center gap-2">
            {editingState["company_type"] ? (
              <select
                {...register("company_type")}
                className="border p-2 rounded"
              >
                <option value="SES">SES</option>
                <option value="SIer">SIer</option>
                <option value="자사서비스">자사서비스</option>
                <option value="기타">기타</option>
              </select>
            ) : (
              <p>{companyType}</p>
            )}
            <CommonButton onClick={() => toggleEdit("company_type")}>
              {editingState["company_type"] ? (
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
              <select
                {...register("interview_type")}
                className="border p-2 rounded"
              >
                <option value="" disabled>
                  면접 유형 선택
                </option>
                {filteredInterviewStatusTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            ) : (
              <p>{interviewType}</p>
            )}
            <CommonButton onClick={() => toggleEdit("interview_type")}>
              {editingState["interview_type"] ? (
                <HiCheck className="w-5 h-5 text-green-600" />
              ) : (
                <HiPencil className="w-4 h-4 text-gray-500" />
              )}
            </CommonButton>
          </div>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date: </span>
          <span suppressHydrationWarning>
            {data.interview_date
              ? new Date(data.interview_date).toLocaleDateString("ko-KR")
              : "분석 중..."}
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
