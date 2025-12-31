"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import { ModalAtom } from "features/Modal/model";
import { InterviewType, updateInterview } from "entities/interview";
import { CommonButton } from "shared/ui";

import { InterviewInfo } from "./InterviewInfo";
import { QuestionList } from "./QuestionList";
import { QACard } from "./QACard";

type InterviweDetailScreenProps = {
  data: InterviewType;
};

const InterviewDetailScreen = ({ data }: InterviweDetailScreenProps) => {
  const router = useRouter();
  const setModal = useSetAtom(ModalAtom);
  const {
    register,
    control,
    watch,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm<InterviewType>({
    defaultValues: data,
    values: data,
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

  const handleSave = async () => {
    try {
      const currentData = getValues();
      await updateInterview(data.id, {
        company_name: currentData.company_name,
        interview_type: currentData.interview_type,
        qa_data: currentData.qa_data,
      });
      toast.success("Saved successfully!");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save.");
    }
  };

  const handleBack = () => {
    if (isDirty) {
      router.push("/confirm");
      setModal({
        title: "알림",
        description: "변경내용을 저장하시겠습니까?",
        confirm: async () => {
          await handleSave();
          router.back();
        },
      });
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4">
        <CommonButton
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiArrowLeft className="w-6 h-6" />
        </CommonButton>
        <h1 className="text-2xl font-bold text-black-333">
          {data.company_name} {data.interview_type}
        </h1>
      </div>

      <InterviewInfo
        data={data}
        register={register}
        watch={watch}
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
    </div>
  );
};

export default InterviewDetailScreen;
