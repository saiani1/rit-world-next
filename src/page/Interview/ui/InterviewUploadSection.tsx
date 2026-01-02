"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getAnalyzeInterview, saveInterview } from "entities/interview";
import { CommonButton, FileInput } from "shared/ui";

export const InterviewUploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const text = await file.text();
      const result = await getAnalyzeInterview(text);
      await saveInterview(result, text);

      toast.success("분석이 완료되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 mx-auto bg-white rounded-xl shadow-md mb-8">
      <h1 className="text-2xl font-bold mb-6">새 면접 기록 분석</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          클로바노트 텍스트 파일 (.txt)
        </label>
        <FileInput
          accept=".txt"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
        />
      </div>
      <CommonButton
        onClick={handleSubmit}
        disabled={!file || isAnalyzing}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? "AI 분석 중..." : "분석 시작"}
      </CommonButton>
    </div>
  );
};
