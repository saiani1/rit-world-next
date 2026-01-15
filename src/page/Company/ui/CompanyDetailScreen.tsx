"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiArrowLeft, HiPencil } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import {
  CompanyTableType,
  COMPANY_TYPES,
  INTERVIEW_STATUS_TYPES,
  INTERVIEW_RESULT_TYPES,
  APPLICATION_METHODS_TYPES,
  updateCompany,
  InterviewListType,
} from "entities/interview";
import { CommonButton, CommonInput } from "shared/ui";

type CompanyDetailScreenProps = {
  companyData: CompanyTableType;
  interviewList: InterviewListType;
};

export const CompanyDetailScreen = ({
  companyData,
  interviewList,
}: CompanyDetailScreenProps) => {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isUndecided, setIsUndecided] = useState(false);
  const [expectedQuestions, setExpectedQuestions] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty, isSubmitting },
  } = useForm<CompanyTableType>({ shouldUnregister: false });

  const nextStepDate = watch("next_step_date");

  const handleUndecidedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUndecided(e.target.checked);
    if (e.target.checked) {
      setValue("next_step_date", "");
    }
  };

  const onSubmit = async (data: CompanyTableType) => {
    try {
      await updateCompany(data.id, data);
      toast.success("변경사항이 저장되었습니다.");
      reset(data); // Reset isDirty
      setEditingSection(null);
    } catch (error) {
      console.error(error);
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    reset();
    const currentData = getValues();
    setIsUndecided(!currentData.next_step_date);
    setEditingSection(null);
  };

  useEffect(() => {
    reset(companyData);
  }, []);

  const renderSectionHeader = (title: string, sectionName: string) => {
    const isEditing = editingSection === sectionName;
    return (
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <CommonButton
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                취소
              </CommonButton>
              <CommonButton
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                저장
              </CommonButton>
            </>
          ) : (
            <CommonButton
              onClick={() => setEditingSection(sectionName)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="수정"
            >
              <HiPencil className="w-4 h-4" />
            </CommonButton>
          )}
        </div>
      </div>
    );
  };

  const ReadOnlyField = ({
    label,
    value,
    isLink = false,
  }: {
    label: string;
    value: string | null | undefined;
    isLink?: boolean;
  }) => (
    <div>
      <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900 min-h-[20px]">
        {value ? (
          isLink ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <span className="whitespace-pre-wrap">{value}</span>
          )
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </dd>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CommonButton
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiArrowLeft className="w-6 h-6" />
        </CommonButton>
        <h1 className="text-2xl font-bold text-gray-900">회사 상세 정보</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        {renderSectionHeader("기본 정보", "basic")}
        {editingSection === "basic" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기업명
              </label>
              <CommonInput
                {...register("name", { required: true })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기업분류
              </label>
              <select
                {...register("type")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {COMPANY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지원일
              </label>
              <input
                type="date"
                {...register("applied_at")}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지원방법
              </label>
              <select
                {...register("application_method")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {APPLICATION_METHODS_TYPES.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지원경로
              </label>
              <CommonInput
                {...register("channel")}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <CommonInput
                {...register("address")}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                구인공고 링크 (JD)
              </label>
              <CommonInput
                {...register("jd_url")}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                홈페이지
              </label>
              <CommonInput
                {...register("homepage_url")}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadOnlyField label="기업명" value={watch("name")} />
            <ReadOnlyField label="기업분류" value={watch("type")} />
            <ReadOnlyField label="지원일" value={watch("applied_at")} />
            <ReadOnlyField
              label="지원방법"
              value={watch("application_method")}
            />
            <ReadOnlyField label="지원경로" value={watch("channel")} />
            <div className="md:col-span-2">
              <ReadOnlyField label="주소" value={watch("address")} />
            </div>
            <ReadOnlyField
              label="구인공고 링크 (JD)"
              value={watch("jd_url")}
              isLink
            />
            <ReadOnlyField
              label="홈페이지"
              value={watch("homepage_url")}
              isLink
            />
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {renderSectionHeader("상세 내용", "details")}
        {editingSection === "details" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기업정보
              </label>
              <textarea
                {...register("info")}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지망동기
              </label>
              <textarea
                {...register("motivation")}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ReadOnlyField label="기업정보" value={watch("info")} />
            <ReadOnlyField label="지망동기" value={watch("motivation")} />
          </div>
        )}
      </div>

      {/* Status Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {renderSectionHeader("전형 현황", "status")}
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
                      ? new Date(watch("next_step_date")!).toLocaleString()
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
          </div>
        )}
      </div>

      {/* Interview Scripts List */}
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

      {/* Expected Questions List */}
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            회사 예상 질문 리스트
          </h2>
          <CommonButton
            onClick={() => {
              /* TODO: Create Question Logic */
              toast("예상 질문 생성 기능 준비 중");
            }}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            + 예상 질문 생성
          </CommonButton>
        </div>
        {expectedQuestions.length > 0 ? (
          <ul className="space-y-2">
            {expectedQuestions.map((question, idx) => (
              <li key={idx} className="p-3 border rounded-lg hover:bg-gray-50">
                {/* Question Item Content */}
                질문 {idx + 1}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">
              등록된 예상 질문이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
