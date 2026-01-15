import { HiArrowLeft } from "react-icons/hi2";

import { useRouter } from "i18n/routing";
import { CommonButton } from "shared/ui";

type CompanyFormHeaderProps = {
  title: string;
};

export const CompanyFormHeader = ({ title }: CompanyFormHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 mb-6">
      <CommonButton
        onClick={() => router.back()}
        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <HiArrowLeft className="w-6 h-6" />
      </CommonButton>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
};
