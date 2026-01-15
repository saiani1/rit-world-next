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

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <CompanyFormHeader title="새 회사 등록" />
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log("Submitting form data:", data);
          try {
            const payload = {
              ...data,
              next_step_date:
                data.next_step_date === "" ? null : data.next_step_date,
            };
            await saveCompany(payload);
            toast.success("회사가 등록되었습니다.");
            router.push("interview/company");
          } catch (error) {
            console.error(error);
            toast.error("회사 등록 중 오류가 발생했습니다.");
          }
        })}
        className="space-y-6"
      >
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
  );
};
