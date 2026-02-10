import { HiChevronDown } from "react-icons/hi2";
import { CommonButton } from "shared/ui";

type QuestionCardProps = {
  category: string;
  question: string;
  answer: string;
  actionButtons?: React.ReactNode;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export const QuestionCard = ({
  category,
  question,
  answer,
  actionButtons,
  className = "",
  isCollapsed = false,
  onToggleCollapse,
}: QuestionCardProps) => {
  return (
    <div
      className={`p-6 border rounded-lg bg-white shadow-sm flex flex-col gap-2 relative group hover:border-blue-200 transition-colors ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 flex-1">
          <CommonButton
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors mr-1"
          >
            <HiChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isCollapsed ? "-rotate-90" : "rotate-0"
              }`}
            />
          </CommonButton>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium whitespace-nowrap">
            {category}
          </span>
          <h3 className="font-medium text-gray-800 line-clamp-1">{question}</h3>
        </div>
        {actionButtons && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
            {actionButtons}
          </div>
        )}
      </div>
      {!isCollapsed && (
        <p className="text-gray-600 text-sm whitespace-pre-wrap pl-8 animate-in fade-in slide-in-from-top-1 duration-200">
          {answer}
        </p>
      )}
    </div>
  );
};
