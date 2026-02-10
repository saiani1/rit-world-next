"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

import { QuestionItem } from "features/Interview";
import {
  getCommonQuestions,
  saveCommonQuestion,
  deleteCommonQuestion,
  CommonQuestionType,
  QUESTION_CATEGORIES,
  UpsertCommonQuestionInput,
} from "entities/interview";
import { CommonButton, CommonInput } from "shared/ui";

type Props = {
  initialQuestions: CommonQuestionType[];
};

export const QuestionTabScreen = ({ initialQuestions }: Props) => {
  const [questions, setQuestions] =
    useState<CommonQuestionType[]>(initialQuestions);
  const [globalFoldState, setGlobalFoldState] = useState<
    "ALL_CLOSED" | "ALL_OPEN" | null
  >("ALL_CLOSED");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    QUESTION_CATEGORIES[0].title
  );

  const { control, register, handleSubmit, reset } =
    useForm<UpsertCommonQuestionInput>({
      defaultValues: {
        category: QUESTION_CATEGORIES[0].title,
        question: "",
        answer: "",
      },
    });

  const fetchQuestions = async () => {
    try {
      const data = await getCommonQuestions();
      setQuestions(data);
    } catch (error) {
      toast.error("질문 목록을 불러오지 못했습니다.");
    }
  };

  const handleToggleAllFold = (): void => {
    setGlobalFoldState((prev) =>
      prev === "ALL_CLOSED" ? "ALL_OPEN" : "ALL_CLOSED"
    );
  };

  const onAddSubmit = async (data: UpsertCommonQuestionInput) => {
    try {
      await saveCommonQuestion({
        datas: {
          ...data,
          display_order: questions.length,
        },
      });
      toast.success("질문이 추가되었습니다.");
      reset();
      fetchQuestions();
    } catch (error) {
      toast.error("추가에 실패했습니다.");
    }
  };

  const handleUpdate = async (updatedItem: CommonQuestionType) => {
    try {
      await saveCommonQuestion({
        datas: {
          id: updatedItem.id,
          question: updatedItem.question,
          answer: updatedItem.answer,
          category: updatedItem.category,
          display_order: updatedItem.display_order,
        },
      });
      toast.success("수정되었습니다.");
      fetchQuestions();
    } catch (error) {
      toast.error("수정에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCommonQuestion(id);
      toast.success("삭제되었습니다.");
      fetchQuestions();
    } catch (error) {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const filteredQuestions = questions.filter(
    (q) => q.category === selectedCategory
  );

  return (
    <div className="w-full mx-auto flex flex-col gap-4 min-w-0">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">공통질문 리스트</h2>
        <CommonButton
          onClick={handleToggleAllFold}
          className="bg-white border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors shadow-sm"
          title={globalFoldState === "ALL_CLOSED" ? "모두 펼치기" : "모두 접기"}
        >
          {globalFoldState === "ALL_CLOSED" ? (
            <HiChevronDown className="w-5 h-5" />
          ) : (
            <HiChevronUp className="w-5 h-5" />
          )}
        </CommonButton>
      </div>
      <section className="bg-gray-50 p-6 bg-white rounded-xl border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          공통 질문 추가
        </h2>
        <form
          onSubmit={handleSubmit(onAddSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full h-[36px] px-3 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    {QUESTION_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                질문
              </label>
              <CommonInput
                {...register("question", { required: true })}
                placeholder="질문을 입력해주세요"
                className="pl-3 w-full h-[36px] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              답변
            </label>
            <textarea
              {...register("answer")}
              placeholder="답변을 입력해주세요"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex justify-end">
            <CommonButton
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              추가하기
            </CommonButton>
          </div>
        </form>
      </section>

      <section className="grid grid-cols-1">
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto flex-nowrap">
          {QUESTION_CATEGORIES.map((cat) => (
            <CommonButton
              key={cat.id}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-4 py-3 font-medium text-sm transition-colors relative whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat.title
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat.title}
              {selectedCategory === cat.title && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
              )}
            </CommonButton>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              등록된 질문이 없습니다.
            </div>
          ) : (
            filteredQuestions.map((item) => (
              <QuestionItem
                key={item.id}
                mode="standalone"
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                globalFoldState={globalFoldState}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};
