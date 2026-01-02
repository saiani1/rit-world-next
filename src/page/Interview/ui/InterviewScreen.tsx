"use client";
import { useEffect, useState } from "react";

import { InterviewListType } from "entities/interview";
import { CommonButton, Title } from "shared/ui";
import { InterviewList } from "./InterviewList";
import { InterviewUploadSection } from "./InterviewUploadSection";
import { PatternAnalysisSection } from "./PatternAnalysisSection";

type InterviewScreenType = {
  data: InterviewListType;
};

type TabType = "interview" | "analysis";

const InterviewScreen = ({ data }: InterviewScreenType) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("interview");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <div>
          <Title name="Interview" />
          <div className="flex space-x-4 mt-6 border-b border-gray-200">
            <CommonButton
              onClick={() => setActiveTab("interview")}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === "interview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              면접
            </CommonButton>
            <CommonButton
              onClick={() => setActiveTab("analysis")}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === "analysis"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              분석
            </CommonButton>
          </div>

          <div className="mt-6">
            {activeTab === "interview" ? (
              <>
                <InterviewUploadSection />
                <InterviewList data={data} />
              </>
            ) : (
              <PatternAnalysisSection />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewScreen;
