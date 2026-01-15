import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ReadOnlyField, SectionHeader } from "features/Company";
import { CompanyTableType } from "entities/interview";

type DetailInfoSectionProps = {
  register: UseFormRegister<CompanyTableType>;
  watch: UseFormWatch<CompanyTableType>;
  isSubmitting: boolean;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const DetailInfoSection = ({
  register,
  watch,
  isSubmitting,
  editingSection,
  setEditingSection,
  onSave,
  onCancel,
}: DetailInfoSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <SectionHeader
        title="상세 내용"
        sectionName="details"
        editingSection={editingSection}
        isSubmitting={isSubmitting}
        setEditingSection={setEditingSection}
        handleCancel={onCancel}
        onSave={onSave}
      />
      {editingSection === "details" ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기업정보
            </label>
            <textarea
              {...register("info")}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지망동기
            </label>
            <textarea
              {...register("motivation")}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ReadOnlyField label="기업정보" value={watch("info")} />
          <ReadOnlyField label="지망동기" value={watch("motivation")} />
        </div>
      )}
    </div>
  );
};
