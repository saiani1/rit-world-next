"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiArrowLeft,
  HiTrash,
  HiCheck,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";
import { useFieldArray, useForm } from "react-hook-form";
import { useAtom, useSetAtom } from "jotai";
import toast from "react-hot-toast";

import { usePathname, useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { QuestionItem } from "features/Interview";
import {
  saveInterviewSet,
  saveQnAItem,
  selectedQuestionsAtom,
  existingQuestionsAtom,
  QUESTION_CATEGORIES,
  INTERVIEW_STATUS_TYPES,
  getInterviewSets,
  getQnAItems,
  deleteInterviewSet,
} from "entities/interview";
import { CommonButton } from "shared/ui";

type QuestionSet = {
  categoryId: number;
  question: string;
  answer: string;
  id?: string;
};

type FormValues = {
  interviewType: string;
  questions: QuestionSet[];
};

export const CompanyQuestionScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const companyName = searchParams.get("companyName");
  const setId = searchParams.get("id");
  const companyId = searchParams.get("companyId") as string;
  const [isLoading, setIsLoading] = useState(!!setId);
  const [globalFoldState, setGlobalFoldState] = useState<
    "ALL_CLOSED" | "ALL_OPEN" | null
  >(null);
  const [selectedQuestions, setSelectedQuestions] = useAtom(
    selectedQuestionsAtom
  );
  const setModal = useSetAtom(ModalAtom);
  const setExistingQuestions = useSetAtom(existingQuestionsAtom);

  const { control, register, handleSubmit, getValues, reset } =
    useForm<FormValues>({
      defaultValues: {
        interviewType: "1차면접",
        questions: [],
      },
    });

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    const fetchSetData = async () => {
      if (!setId) return;
      try {
        const [sets, questions] = await Promise.all([
          getInterviewSets({ id: setId }),
          getQnAItems(setId),
        ]);

        if (sets && sets.length > 0) {
          const set = sets[0];
          const formattedQuestions = questions.map((q) => {
            const categoryObj = QUESTION_CATEGORIES.find(
              (c) => c.title === q.category
            );
            return {
              categoryId: categoryObj ? Number(categoryObj.id) : 0,
              question: q.question,
              answer: q.answer,
              id: q.id,
            };
          });

          reset({
            interviewType: set.status_tag,
            questions: formattedQuestions,
          });
        }
      } catch (error) {
        toast.error("데이터를 불러오는데 실패했습니다.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetData();
  }, [setId, reset]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedQuestions.length > 0) {
      const currentQuestions = getValues("questions");

      const newQuestions = selectedQuestions.filter(
        (q) =>
          !currentQuestions.some((existing) => existing.question === q.question)
      );

      newQuestions.forEach((q) => {
        const categoryObj = QUESTION_CATEGORIES.find(
          (c) => c.title === q.category
        );
        prepend({
          categoryId: categoryObj ? Number(categoryObj.id) : 0,
          question: q.question,
          answer: q.answer,
        });
      });
      setSelectedQuestions([]);
    }
  }, [selectedQuestions, prepend, setSelectedQuestions, getValues]);

  const onSubmit = async (data: FormValues) => {
    try {
      const interviewSet = await saveInterviewSet({
        datas: {
          company_id: companyId,
          title: `${data.interviewType} 예상 질문 리스트`,
          status_tag: data.interviewType,
          id: setId || undefined,
        } as any,
      });

      if (interviewSet?.id) {
        await Promise.all(
          data.questions.map((q, index) => {
            const categoryObj = QUESTION_CATEGORIES.find(
              (c) => c.id === Number(q.categoryId)
            );
            return saveQnAItem({
              datas: {
                set_id: interviewSet.id,
                question: q.question,
                answer: q.answer,
                category: categoryObj ? categoryObj.title : "기타",
                display_order: index,
                id: q.id || undefined,
              } as any,
            });
          })
        );
        toast.success(
          setId ? "수정되었습니다." : "질문 리스트가 저장되었습니다."
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save interview set:", error);
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleOpenModal = () => {
    const currentQuestions = getValues("questions").map((q) => ({
      ...q,
      category:
        QUESTION_CATEGORIES.find((c) => c.id === Number(q.categoryId))?.title ||
        "기타",
    }));
    setExistingQuestions(currentQuestions);
    router.push(`${pathname}/select-questions`);
  };

  const handleDeleteSet = () => {
    setModal({
      title: "삭제 확인",
      description: "정말 이 질문 리스트를 삭제하시겠습니까?",
      confirm: async () => {
        if (!setId) return;
        try {
          await deleteInterviewSet(setId);
          toast.success("질문 리스트가 삭제되었습니다.");
          router.refresh();
          router.push(`/interview/company/${companyId}`);
        } catch (error) {
          console.error("Failed to delete interview set:", error);
          toast.error("삭제에 실패했습니다.");
        }
      },
    });
  };

  const handleToggleAllFold = () => {
    setGlobalFoldState((prev) =>
      prev === "ALL_CLOSED" ? "ALL_OPEN" : "ALL_CLOSED"
    );
  };

  const sortedFields = useMemo(
    () =>
      fields
        .map((field, index) => ({ field, index }))
        .sort((a, b) => {
          const catA = a.field.categoryId ?? 999;
          const catB = b.field.categoryId ?? 999;
          return catA - catB;
        }),
    [fields]
  );

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <div className="flex sm:items-center items-start gap-2 mb-4">
          <CommonButton
            onClick={() => router.back()}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiArrowLeft className="w-6 h-6" />
          </CommonButton>
          <div className="flex sm:flex-row flex-col flex-1 justify-between items-center">
            <h2 className="text-2xl font-bold">
              {companyName ? `${companyName} ` : ""}예상 질문 리스트{" "}
              {setId ? "수정" : "생성"}
            </h2>
            <div className="flex items-center gap-1">
              <CommonButton
                onClick={handleToggleAllFold}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                title={
                  globalFoldState === "ALL_CLOSED" ? "모두 펼치기" : "모두 접기"
                }
              >
                {globalFoldState === "ALL_CLOSED" ? (
                  <HiChevronDown className="w-6 h-6" />
                ) : (
                  <HiChevronUp className="w-6 h-6" />
                )}
              </CommonButton>
              <CommonButton
                type="submit"
                form="question-form"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="저장하기"
              >
                <HiCheck className="w-6 h-6" />
              </CommonButton>
              {setId && (
                <CommonButton
                  onClick={handleDeleteSet}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="삭제하기"
                >
                  <HiTrash className="w-6 h-6" />
                </CommonButton>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="sm:block hidden text-sm font-medium text-gray-700 whitespace-nowrap">
                면접 유형
              </label>
              <select
                {...register("interviewType")}
                className="h-[34px] pl-3 pr-8 bg-white border border-gray-300 rounded-[5px] text-[13px] text-gray-700 focus:outline-blue-500 appearance-none cursor-pointer min-w-[120px]"
              >
                {INTERVIEW_STATUS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <CommonButton
              onClick={handleOpenModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              질문 가져오기
            </CommonButton>
          </div>
        </div>
      </div>

      <form
        id="question-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex justify-center">
          <CommonButton
            onClick={() => prepend({ categoryId: 0, question: "", answer: "" })}
            className="flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 px-6 py-3 border border-blue-100 rounded-full hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg">+</span> 질문 추가하기
          </CommonButton>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          sortedFields.map(({ field, index }, renderIndex, array) => {
            const prevField = array[renderIndex - 1];
            const currentCategory = field.categoryId;
            const prevCategory = prevField?.field.categoryId;
            const showSeparator =
              renderIndex > 0 && currentCategory !== prevCategory;
            const categoryTitle = QUESTION_CATEGORIES.find(
              (c) => c.id === currentCategory
            )?.title;

            return (
              <div key={field.id} className="flex flex-col gap-4">
                {showSeparator && (
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-sm font-medium text-gray-500">
                      {categoryTitle || "기타"}
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                )}
                <QuestionItem
                  mode="field-array"
                  field={field}
                  index={index}
                  control={control}
                  register={register}
                  remove={remove}
                  showRemove={true}
                  globalFoldState={globalFoldState}
                />
              </div>
            );
          })
        )}
      </form>
    </div>
  );
};
