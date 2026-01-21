"use client";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";
import { HiArrowLeft, HiArrowUp, HiTrash } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import {
  CompanyTableType,
  InterviewType,
  updateInterview,
  deleteInterview,
} from "entities/interview";
import { CommonButton } from "shared/ui";
import { InterviewInfo } from "./InterviewInfo";
import { QuestionList } from "./QuestionList";
import { QACard } from "./QACard";

type InterviweDetailScreenProps = {
  interviewData: InterviewType;
  companyList: Pick<
    CompanyTableType,
    "id" | "name" | "type" | "applied_at" | "status" | "result"
  >[];
};

const InterviewDetailScreen = ({
  interviewData,

  companyList,
}: InterviweDetailScreenProps) => {
  const router = useRouter();
  const setModal = useSetAtom(ModalAtom);

  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { isDirty },
  } = useForm<InterviewType>({
    defaultValues: interviewData,
    values: interviewData,
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "qa_data",
  });

  const scrollToQuestion = (index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    try {
      const currentData = getValues();
      await updateInterview(interviewData.id, {
        company_id: currentData.company_id,
        company_name: currentData.company_name,
        company_type: currentData.company_type,
        interview_type: currentData.interview_type,
        qa_data: currentData.qa_data,
      });
      toast.success("변경사항이 반영되었습니다.");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("변경사항 반영에 실패했습니다.");
    }
  };

  const callDeleteInterview = async () => {
    try {
      await deleteInterview(interviewData.id);
      toast.success("인터뷰가 삭제되었습니다.");
      router.push("/interview/record");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("삭제 실패");
    }
  };

  const handleDeleteClick = () => {
    router.push("/confirm");
    setModal({
      title: "인터뷰 삭제",
      description: "해당 인터뷰를 삭제하시겠습니까?",
      confirm: callDeleteInterview,
    });
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CommonButton
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
          </CommonButton>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-black-333">
              {interviewData.company_name} {interviewData.interview_type}
            </h1>
            {interviewData.company_type && (
              <span className="inline-block px-2 py-1 text-sm font-bold text-white bg-gray-400 rounded-md ml-2">
                {interviewData.company_type}
              </span>
            )}
          </div>
        </div>
        <CommonButton
          onClick={handleDeleteClick}
          className="px-4 py-1 bg-red-500 text-sm text-white rounded-md hover:bg-red-600 transition-colors"
        >
          삭제
        </CommonButton>
      </div>

      <InterviewInfo
        data={interviewData}
        companyList={companyList}
        register={register}
        watch={watch}
        setValue={setValue}
        isDirty={isDirty}
        onSave={handleSave}
      />

      <QuestionList
        fields={fields}
        watch={watch}
        onScrollToQuestion={scrollToQuestion}
      />

      <section className="flex flex-col gap-6">
        {fields.map((field, index) => (
          <QACard
            key={field.id}
            index={index}
            register={register}
            watch={watch}
            remove={remove}
          />
        ))}
      </section>

      <CommonButton
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Scroll to top"
      >
        <HiArrowUp className="w-6 h-6" />
      </CommonButton>
    </div>
  );
};

export default InterviewDetailScreen;
