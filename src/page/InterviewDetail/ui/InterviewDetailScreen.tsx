"use client";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { HiArrowLeft, HiArrowUp } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
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
  const {
    register,
    control,
    watch,
    getValues,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    try {
      const currentData = getValues();
      await updateInterview(data.id, {
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

  const handleBack = () => {
    router.push("/interview");
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
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-black-333">
            {data.company_name} {data.interview_type}
          </h1>
          {data.company_type && (
            <span className="inline-block px-2 py-1 text-sm font-bold text-white bg-gray-400 rounded-md">
              {data.company_type}
            </span>
          )}
        </div>
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
