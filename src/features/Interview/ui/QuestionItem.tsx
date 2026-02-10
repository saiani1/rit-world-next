"use client";
import { useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  useWatch,
  Controller,
  Control,
  UseFormRegister,
  UseFieldArrayRemove,
  useForm,
} from "react-hook-form";
import { HiXMark, HiCheck, HiTrash } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { QUESTION_CATEGORIES, CommonQuestionType } from "entities/interview";
import { CommonButton, CommonInput } from "shared/ui";
import { QuestionCard } from "./QuestionCard";

export type QuestionItemType = {
  categoryId: number;
  question: string;
  answer: string;
};

export type QuestionFormValues = {
  questions: QuestionItemType[];
};

type FieldArrayProps = {
  mode: "field-array";
  field: QuestionItemType & { id: string };
  index: number;
  control: Control<any>;
  register: UseFormRegister<any>;
  remove: UseFieldArrayRemove;
  showRemove: boolean;
  globalFoldState?: "ALL_CLOSED" | "ALL_OPEN" | null;
};

type StandaloneProps = {
  mode: "standalone";
  item: CommonQuestionType;
  onUpdate: (updatedItem: CommonQuestionType) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  globalFoldState?: "ALL_CLOSED" | "ALL_OPEN" | null;
};

type QuestionItemProps = FieldArrayProps | StandaloneProps;

export const QuestionItem = (props: QuestionItemProps) => {
  const isFieldArray = props.mode === "field-array";
  const setModal = useSetAtom(ModalAtom);
  const router = useRouter();

  const fieldArrayProps = isFieldArray ? (props as FieldArrayProps) : undefined;
  const standaloneProps = !isFieldArray
    ? (props as StandaloneProps)
    : undefined;

  const {
    control: localControl,
    register: localRegister,
    handleSubmit: localHandleSubmit,
    watch: localWatch,
    reset: localReset,
  } = useForm({
    defaultValues: standaloneProps
      ? {
          category: standaloneProps.item.category,
          question: standaloneProps.item.question,
          answer: standaloneProps.item.answer,
        }
      : {},
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  const [isEditing, setIsEditing] = useState(
    isFieldArray ? !fieldArrayProps!.field.question : false
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  /* eslint-enable react-hooks/exhaustive-deps */

  const watchedFieldArray = useWatch({
    control: (isFieldArray ? fieldArrayProps?.control : localControl) as any,
    name: isFieldArray ? `questions.${fieldArrayProps?.index}` : "question",
    defaultValue: isFieldArray ? fieldArrayProps?.field : undefined,
  });

  const standaloneValues = localWatch();

  const currentValues = isFieldArray
    ? {
        categoryTitle:
          QUESTION_CATEGORIES.find(
            (c) => c.id === Number(watchedFieldArray?.categoryId)
          )?.title || "카테고리 미선택",
        question: watchedFieldArray?.question,
        answer: watchedFieldArray?.answer,
      }
    : {
        categoryTitle: standaloneValues.category,
        question: standaloneValues.question,
        answer: standaloneValues.answer,
      };

  const handleStandaloneSubmit = async (data: any) => {
    if (standaloneProps?.onUpdate) {
      await standaloneProps.onUpdate({
        ...standaloneProps.item,
        ...data,
      });
      setIsEditing(false);
    }
  };

  const handleComplete = () => {
    if (isFieldArray) {
      setIsEditing(false);
    } else {
      localHandleSubmit(handleStandaloneSubmit)();
    }
  };

  const handleRemove = () => {
    if (isFieldArray && fieldArrayProps) {
      fieldArrayProps.remove(fieldArrayProps.index);
    } else if (standaloneProps?.onDelete) {
      standaloneProps.onDelete(standaloneProps.item.id);
    }
  };

  const handleCancel = () => {
    if (isFieldArray) {
      setIsEditing(false);
    } else {
      localReset({
        category: standaloneProps?.item.category,
        question: standaloneProps?.item.question,
        answer: standaloneProps?.item.answer,
      });
      setIsEditing(false);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (props.globalFoldState === "ALL_CLOSED") {
      setIsCollapsed(true);
    } else if (props.globalFoldState === "ALL_OPEN") {
      setIsCollapsed(false);
    }
  }, [props.globalFoldState]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!isEditing) {
    return (
      <div className="group relative">
        <QuestionCard
          category={currentValues.categoryTitle || "카테고리 미선택"}
          question={currentValues.question || "질문 없음"}
          answer={currentValues.answer || ""}
          className="border-gray-200"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-full backdrop-blur-sm z-10">
          <CommonButton
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <span className="text-sm font-medium">수정</span>
          </CommonButton>

          <CommonButton
            onClick={(e) => {
              e.stopPropagation();
              setModal({
                title: "안내",
                description: "정말 삭제하시겠습니까?",
                confirm: handleRemove,
              });
              router.push("/confirm");
            }}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <HiXMark size={20} />
          </CommonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3 relative">
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex gap-2">
            <Controller
              control={isFieldArray ? fieldArrayProps?.control : localControl}
              name={
                isFieldArray
                  ? `questions.${fieldArrayProps?.index}.categoryId`
                  : "category"
              }
              render={({ field: { onChange, value } }) => (
                <select
                  value={
                    isFieldArray
                      ? value
                      : QUESTION_CATEGORIES.find((c) => c.title === value)
                          ?.id || 0
                  }
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    if (isFieldArray) {
                      onChange(selectedId);
                    } else {
                      const selectedTitle = QUESTION_CATEGORIES.find(
                        (c) => c.id === selectedId
                      )?.title;
                      onChange(selectedTitle);
                    }
                  }}
                  className="h-[40px] px-3 border border-gray-300 rounded-md text-sm min-w-[120px] focus:outline-blue-500"
                >
                  <option value={0} disabled>
                    카테고리 선택
                  </option>
                  {QUESTION_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              )}
            />
            <CommonInput
              {...(isFieldArray
                ? fieldArrayProps?.register(
                    `questions.${fieldArrayProps.index}.question`
                  )
                : localRegister("question"))}
              placeholder="질문"
              className="px-3 w-full h-[40px] border rounded-md border-gray-300 focus:outline-blue-500"
            />
          </div>
        </div>
      </div>

      <textarea
        {...(isFieldArray
          ? fieldArrayProps?.register(
              `questions.${fieldArrayProps.index}.answer`
            )
          : localRegister("answer"))}
        placeholder="답변"
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-blue-500"
      />

      <div className="flex justify-end gap-2">
        <CommonButton
          onClick={() => {
            setModal({
              title: "안내",
              description: "정말 삭제하시겠습니까?",
              confirm: handleRemove,
            });
            router.push("/confirm");
          }}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors order-first mr-auto"
        >
          <HiTrash size={20} />
        </CommonButton>

        <CommonButton
          onClick={handleCancel}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiXMark size={20} />
        </CommonButton>

        <CommonButton
          onClick={handleComplete}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <HiCheck size={20} />
        </CommonButton>
      </div>
    </div>
  );
};
