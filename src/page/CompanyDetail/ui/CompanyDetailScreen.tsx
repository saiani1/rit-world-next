"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import {
  CompanyTableType,
  updateCompany,
  InterviewListType,
} from "entities/interview";
import { CommonButton } from "shared/ui";
import { BasicInfoSection } from "./BasicInfoSection";
import { DetailInfoSection } from "./DetailInfoSection";
import { StatusInfoSection } from "./StatusInfoSection";
import { InterviewScriptList } from "./InterviewScriptList";
import { ExpectedQuestionList } from "./ExpectedQuestionList";

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
    formState: { isSubmitting },
  } = useForm<CompanyTableType>({ shouldUnregister: false });

  useEffect(() => {
    reset(companyData);
    if (!companyData.next_step_date) {
      setIsUndecided(true);
    }
  }, [companyData, reset]);

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
      reset(data);
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

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CommonButton
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiArrowLeft className="w-6 h-6" />
        </CommonButton>
        <h1 className="text-2xl font-bold text-gray-900">회사 상세 정보</h1>
      </div>

      <BasicInfoSection
        register={register}
        watch={watch}
        isSubmitting={isSubmitting}
        editingSection={editingSection}
        setEditingSection={setEditingSection}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      />

      <DetailInfoSection
        register={register}
        watch={watch}
        isSubmitting={isSubmitting}
        editingSection={editingSection}
        setEditingSection={setEditingSection}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
      />

      <StatusInfoSection
        register={register}
        watch={watch}
        isSubmitting={isSubmitting}
        editingSection={editingSection}
        setEditingSection={setEditingSection}
        onSave={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isUndecided={isUndecided}
        onUndecidedChange={handleUndecidedChange}
      />

      <InterviewScriptList interviewList={interviewList} />

      <ExpectedQuestionList
        questions={expectedQuestions}
        onCreate={() => toast("예상 질문 생성 기능 준비 중")}
      />
    </div>
  );
};
