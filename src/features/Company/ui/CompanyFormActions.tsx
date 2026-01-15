import { CommonButton } from "shared/ui";

type CompanyFormActionsProps = {
  isSubmitting: boolean;
  onCancel: () => void;
};

export const CompanyFormActions = ({
  isSubmitting,
  onCancel,
}: CompanyFormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <CommonButton
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        취소
      </CommonButton>
      <CommonButton
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? "등록 중..." : "등록하기"}
      </CommonButton>
    </div>
  );
};
