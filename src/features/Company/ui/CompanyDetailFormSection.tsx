import { UseFormRegister } from "react-hook-form";

import { CompanyTableType } from "entities/interview";

type CompanyDetailFormSectionProps = {
  register: UseFormRegister<CompanyTableType>;
};

export const CompanyDetailFormSection = ({
  register,
}: CompanyDetailFormSectionProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          기업정보
        </label>
        <textarea
          {...register("info")}
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
          {...register("motivation")}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="이 회사에 지원한 동기를 작성하세요"
        />
      </div>
    </>
  );
};
