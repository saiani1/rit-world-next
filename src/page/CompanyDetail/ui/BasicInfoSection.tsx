import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ReadOnlyField, SectionHeader } from "features/Company";
import {
  CompanyTableType,
  COMPANY_TYPES,
  APPLICATION_METHODS_TYPES,
} from "entities/interview";
import { CommonInput } from "shared/ui";

type BasicInfoSectionProps = {
  register: UseFormRegister<CompanyTableType>;
  watch: UseFormWatch<CompanyTableType>;
  isSubmitting: boolean;
  editingSection: string | null;
  setEditingSection: (section: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const BasicInfoSection = ({
  register,
  watch,
  isSubmitting,
  editingSection,
  setEditingSection,
  onSave,
  onCancel,
}: BasicInfoSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <SectionHeader
        title="기본 정보"
        sectionName="basic"
        editingSection={editingSection}
        isSubmitting={isSubmitting}
        setEditingSection={setEditingSection}
        handleCancel={onCancel}
        onSave={onSave}
      />
      {editingSection === "basic" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기업명
            </label>
            <CommonInput
              {...register("name", { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기업분류
            </label>
            <select
              {...register("type")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지원일
            </label>
            <input
              type="date"
              {...register("applied_at")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지원방법
            </label>
            <select
              {...register("application_method")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {APPLICATION_METHODS_TYPES.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지원경로
            </label>
            <CommonInput
              {...register("channel")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <CommonInput
              {...register("address")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              구인공고 링크 (JD)
            </label>
            <CommonInput
              {...register("jd_url")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              홈페이지
            </label>
            <CommonInput
              {...register("homepage_url")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="기업명" value={watch("name")} />
          <ReadOnlyField label="기업분류" value={watch("type")} />
          <ReadOnlyField label="지원일" value={watch("applied_at")} />
          <ReadOnlyField label="지원방법" value={watch("application_method")} />
          <ReadOnlyField label="지원경로" value={watch("channel")} />
          <div className="md:col-span-2">
            <ReadOnlyField label="주소" value={watch("address")} />
          </div>
          <ReadOnlyField
            label="구인공고 링크 (JD)"
            value={watch("jd_url")}
            isLink
          />
          <ReadOnlyField
            label="홈페이지"
            value={watch("homepage_url")}
            isLink
          />
        </div>
      )}
    </div>
  );
};
