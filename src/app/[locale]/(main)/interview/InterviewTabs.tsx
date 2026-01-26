"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import { Link } from "i18n/routing";

const InterviewTabs = () => {
  const segment = useSelectedLayoutSegment();
  const activeTab =
    segment === "company"
      ? "company"
      : segment === "questions"
        ? "questions"
        : "interview";

  return (
    <div className="flex space-x-4 mt-6 border-b border-gray-200">
      <Link
        href="/interview/company"
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === "company"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        회사
      </Link>
      <Link
        href="/interview/record"
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === "interview"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        면접
      </Link>
      <Link
        href="/interview/questions"
        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
          activeTab === "questions"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        질문
      </Link>
    </div>
  );
};

export default InterviewTabs;
