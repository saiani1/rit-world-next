import { HiPencil } from "react-icons/hi2";

import { CommonButton } from "shared/ui";

type SectionHeaderProps = {
  title: string;
  sectionName: string;
  editingSection: string | null;
  isSubmitting: boolean;
  setEditingSection: (section: string | null) => void;
  handleCancel: () => void;
  onSave: () => void;
};

export const SectionHeader = ({
  title,
  sectionName,
  editingSection,
  isSubmitting,
  setEditingSection,
  handleCancel,
  onSave,
}: SectionHeaderProps) => {
  const isEditing = editingSection === sectionName;
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <CommonButton
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              취소
            </CommonButton>
            <CommonButton
              onClick={onSave}
              disabled={isSubmitting}
              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              저장
            </CommonButton>
          </>
        ) : (
          <CommonButton
            onClick={() => setEditingSection(sectionName)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="수정"
          >
            <HiPencil className="w-4 h-4" />
          </CommonButton>
        )}
      </div>
    </div>
  );
};
