"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";

import {
  getCommonQuestions,
  CommonQuestionType,
  selectedQuestionsAtom,
  QUESTION_CATEGORIES,
} from "entities/interview";
import { CommonButton } from "shared/ui";

export const SelectQuestionModal = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<CommonQuestionType[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<
    CommonQuestionType[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setGlobalSelectedQuestions] = useAtom(selectedQuestionsAtom);
  const [tempSelectedQuestions, setTempSelectedQuestions] = useState<
    CommonQuestionType[]
  >([]);

  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = "0px";
    };
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getCommonQuestions();
        setQuestions(data);
        setFilteredQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(
        questions.filter((q) => q.category === selectedCategory)
      );
    }
  }, [selectedCategory, questions]);

  const handleSelect = (item: CommonQuestionType) => {
    if (tempSelectedQuestions.some((q) => q.id === item.id)) {
      setTempSelectedQuestions((prev) => prev.filter((q) => q.id !== item.id));
    } else {
      setTempSelectedQuestions((prev) => [...prev, item]);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleAdd = () => {
    setGlobalSelectedQuestions(tempSelectedQuestions);
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 w-full h-full bg-black-333/30"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            질문 리스트 가져오기
          </h2>
          <CommonButton
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </CommonButton>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <CommonButton
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </CommonButton>
            {QUESTION_CATEGORIES.map((cat) => (
              <CommonButton
                key={cat.id}
                onClick={() => setSelectedCategory(cat.title)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.title
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.title}
              </CommonButton>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuestions.map((item) => {
              const isSelected = tempSelectedQuestions.some(
                (q) => q.id === item.id
              );
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all relative group hover:shadow-md ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {item.category}
                    </span>
                    {isSelected && (
                      <IoCheckmarkCircle className="text-blue-500 text-xl" />
                    )}
                  </div>
                  <p className="text-gray-800 font-medium line-clamp-2 mb-2">
                    {item.question}
                  </p>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex flex-col gap-4">
          {tempSelectedQuestions.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600">
                선택된 질문 ({tempSelectedQuestions.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tempSelectedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex-shrink-0 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    <span className="max-w-[150px] truncate">{q.question}</span>
                    <CommonButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(q);
                      }}
                      className="hover:text-blue-900"
                    >
                      <IoClose size={14} />
                    </CommonButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <CommonButton
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </CommonButton>
            <CommonButton
              onClick={handleAdd}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300"
            >
              추가하기
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};
