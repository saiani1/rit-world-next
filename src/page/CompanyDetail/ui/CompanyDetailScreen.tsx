"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";
import { HiArrowLeft } from "react-icons/hi2";
import dayjs from "dayjs";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { updateCompanyHistory } from "features/Company";
import {
  CompanyTableType,
  updateCompany,
  InterviewListType,
  deleteCompany,
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
  const setModal = useSetAtom(ModalAtom);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<CompanyTableType>({
    shouldUnregister: false,
  });

  useEffect(() => {
    reset({
      ...companyData,
      next_step_date: companyData.next_step_date
        ? dayjs.utc(companyData.next_step_date).format("YYYY-MM-DDTHH:mm")
        : "",
    });
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
      const basePayload = {
        ...data,
        next_step_date: data.next_step_date === "" ? null : data.next_step_date,
      };

      let finalPayload: CompanyTableType = basePayload;

      if (
        basePayload.status !== companyData.status ||
        basePayload.result !== companyData.result
      ) {
        finalPayload = updateCompanyHistory({
          company: { ...companyData, ...basePayload },
          newStatus: basePayload.status,
          newResult: basePayload.result,
          sourceNotificationDate: dayjs().toISOString(),
        });
      }

      await updateCompany(finalPayload.id, finalPayload);
      toast.success("변경사항이 저장되었습니다.");
      reset(finalPayload);
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

  const callDeleteCompany = async () => {
    try {
      await deleteCompany(companyData.id);
      toast.success("회사가 삭제되었습니다.");
      router.push("/interview/company");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("회사 삭제에 실패했습니다.");
    }
  };

  const handleDeleteClick = () => {
    router.push("/confirm");
    setModal({
      title: "회사 삭제",
      description: `"${companyData.name}" 회사를 삭제하시겠습니까?`,
      confirm: callDeleteCompany,
    });
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CommonButton
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiArrowLeft className="w-6 h-6" />
          </CommonButton>
          <h1 className="text-2xl font-bold text-gray-900">회사 상세 정보</h1>
        </div>
        <CommonButton
          onClick={handleDeleteClick}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          삭제
        </CommonButton>
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
        companyData={companyData}
      />

      <InterviewScriptList interviewList={interviewList} />

      <ExpectedQuestionList
        questions={expectedQuestions}
        onCreate={() => toast("예상 질문 생성 기능 준비 중")}
      />
    </div>
  );
};
