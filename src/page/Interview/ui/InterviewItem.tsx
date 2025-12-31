"use client";
import { HiXMark } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useSetAtom } from "jotai";

import { useRouter } from "i18n/routing";
import { ModalAtom } from "features/Modal";
import { deleteInterview, InterviewListType } from "entities/interview";
import { CommonButton } from "shared/ui";

type InterviewItemProps = {
  item: InterviewListType[number];
};

export const InterviewItem = ({ item }: InterviewItemProps) => {
  const router = useRouter();
  const setModal = useSetAtom(ModalAtom);

  const callDeleteInterview = async () => {
    try {
      await deleteInterview(item.id);
      toast.success("삭제되었습니다.");
      router.refresh();
      router.push("/interview");
    } catch (error) {
      console.error(error);
      toast.error("삭제 실패");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/confirm");
    setModal({
      title: "인터뷰 삭제",
      description: "해당 인터뷰를 삭제하시겠습니까?",
      confirm: callDeleteInterview,
    });
  };

  const handleCardClick = () => {
    router.push(`/interview/${item.id}`);
  };

  return (
    <li
      onClick={handleCardClick}
      className="flex justify-between p-4 bg-white shadow-md rounded-lg transition-colors group hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <p className="text-sm text-gray-500">{item.interview_date}</p>
          <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
        </div>
        <div className="flex flex-col items-end gap-1 pr-6">
          <h3 className="text-lg font-bold text-black-555">
            {item.company_name}
          </h3>
          <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-blue-100 rounded">
            {item.interview_type}
          </span>
        </div>
      </div>
      <CommonButton
        onClick={handleDelete}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors z-10"
        title="삭제"
      >
        <HiXMark className="w-5 h-5" />
      </CommonButton>
    </li>
  );
};
