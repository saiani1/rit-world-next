import { AnalysisResult } from "../model/type";

export const getAnalyzeInterview = async (
  text: string
): Promise<AnalysisResult> => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("분석 요청 실패");
  }

  return response.json();
};
