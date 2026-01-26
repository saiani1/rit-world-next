"use client";
type QuestionCardProps = {
  category: string;
  question: string;
  answer: string;
  actionButtons?: React.ReactNode;
  className?: string;
};

export const QuestionCard = ({
  category,
  question,
  answer,
  actionButtons,
  className = "",
}: QuestionCardProps) => {
  return (
    <div
      className={`p-6 border rounded-lg bg-white shadow-sm flex flex-col gap-2 relative group hover:border-blue-200 transition-colors ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
            {category}
          </span>
          <h3 className="font-medium text-gray-800">{question}</h3>
        </div>
        {actionButtons && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {actionButtons}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm whitespace-pre-wrap">{answer}</p>
    </div>
  );
};
