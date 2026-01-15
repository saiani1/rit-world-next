import { UseFormRegister } from "react-hook-form";

import {
  CompanyTableType,
  COMPANY_TYPES,
  APPLICATION_METHODS_TYPES,
} from "entities/interview";
import { CommonInput } from "shared/ui";

type CompanyBasicFormSectionProps = {
  register: UseFormRegister<CompanyTableType>;
};

export const CompanyBasicFormSection = ({
  register,
}: CompanyBasicFormSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          기업명 <span className="text-red-500">*</span>
        </label>
        <CommonInput
          {...register("name", { required: true })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="기업명을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          기업분류
        </label>
        <select
          {...register("type")}
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
          {...register("applied_at")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          지원방법
        </label>
        <select
          {...register("application_method")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="예: 원티드, 링크드인"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          주소
        </label>
        <CommonInput
          {...register("address")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="회사 주소"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          구인공고 링크 (JD)
        </label>
        <CommonInput
          {...register("jd_url")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          홈페이지
        </label>
        <CommonInput
          {...register("homepage_url")}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://..."
        />
      </div>
    </div>
  );
};
