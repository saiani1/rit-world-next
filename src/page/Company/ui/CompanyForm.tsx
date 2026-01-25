"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { useRouter } from "i18n/routing";
import {
  CompanyBasicFormSection,
  CompanyDetailFormSection,
  CompanyFormActions,
  CompanyFormHeader,
  CompanyStatusFormSection,
  updateCompanyHistory,
} from "features/Company";
import { CompanyTableType, saveCompany } from "entities/interview";

export const CompanyForm = () => {
  const router = useRouter();
  const [isUndecided, setIsUndecided] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompanyTableType>();

  const submit = async (data: CompanyTableType) => {
    try {
      // next_step_date가 빈 문자열이면 null로 처리
      const basePayload = {
        ...data,
        next_step_date: data.next_step_date === "" ? null : data.next_step_date,
      };

      // updateCompanyHistory 유틸리티 함수를 사용하여 history 배열 업데이트
      const finalPayload = updateCompanyHistory({
        company: basePayload,
        newStatus: basePayload.status,
        newResult: basePayload.result,
        sourceAppliedAt: basePayload.applied_at, //서류전형의 날짜 소스로 applied_at 사용
      });
      await saveCompany(finalPayload);
      toast.success("회사가 등록되었습니다.");
      router.push("/interview/company");
      router.refresh(); // CompanyScreen의 데이터를 다시 불러오도록 강제
    } catch (error) {
      console.error(error);
      toast.error("회사 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <CompanyFormHeader title="새 회사 등록" />
      <div className="mx-auto bg-white p-8 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <CompanyBasicFormSection register={register} />
          <CompanyDetailFormSection register={register} />
          <CompanyStatusFormSection
            register={register}
            watch={watch}
            setValue={setValue}
            isUndecided={isUndecided}
            setIsUndecided={setIsUndecided}
          />
          <CompanyFormActions
            isSubmitting={isSubmitting}
            onCancel={() => router.back()}
          />
        </form>
      </div>
    </div>
  );
};
