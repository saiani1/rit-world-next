"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import {
  CompanyTableType,
  COMPANY_TYPES,
  INTERVIEW_STATUS_TYPES,
  APPLICATION_METHODS_TYPES,
  INTERVIEW_RESULT_TYPES,
  saveCompany,
} from "entities/interview";
import { CommonButton, CommonInput } from "shared/ui";

export const CompanyForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CompanyTableType>(
    {} as CompanyTableType
  );
  const [isUndecided, setIsUndecided] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUndecidedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUndecided(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, next_step_date: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);
    try {
      await saveCompany(formData);
      toast.success("회사가 등록되었습니다.");
      router.push("interview/company");
    } catch (error) {
      console.error(error);
      toast.error("회사 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <CommonButton
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiArrowLeft className="w-6 h-6" />
        </CommonButton>
        <h1 className="text-2xl font-bold text-gray-900">새 회사 등록</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기업명 <span className="text-red-500">*</span>
            </label>
            <CommonInput
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="기업명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기업분류
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              name="applied_at"
              value={formData.applied_at}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지원방법
            </label>
            <select
              name="application_method"
              value={formData.application_method}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {APPLICATION_METHODS_TYPES.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* 지원경로 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지원경로
            </label>
            <CommonInput
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 원티드, 링크드인"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              구인공고 링크 (JD)
            </label>
            <CommonInput
              name="jd_url"
              value={formData.jd_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              홈페이지
            </label>
            <CommonInput
              name="homepage_url"
              value={formData.homepage_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주소
          </label>
          <CommonInput
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="회사 주소"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기업정보
          </label>
          <textarea
            name="info"
            value={formData.info}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="기업에 대한 주요 정보를 메모하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            지망동기
          </label>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="이 회사에 지원한 동기를 작성하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 전형 단계
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
              name="result"
              value={formData.result}
              onChange={handleChange}
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
                name="next_step_date"
                value={formData.next_step_date || ""}
                onChange={handleChange}
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
              name="meeting_url"
              value={formData.meeting_url || ""}
              onChange={handleChange}
              disabled={!formData.next_step_date}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="면접 링크를 입력하세요 (Zoom, Google Meet 등)"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <CommonButton
            type="reset"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </CommonButton>
          <CommonButton
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </CommonButton>
        </div>
      </form>
    </div>
  );
};
