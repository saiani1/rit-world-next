"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { PatternAnalysisResultType } from "entities/interview";
import { CommonButton } from "shared/ui";

export const PatternAnalysisSection = () => {
  const [isPatternAnalyzing, setIsPatternAnalyzing] = useState(false);
  const [patternData, setPatternData] =
    useState<PatternAnalysisResultType | null>(null);

  useEffect(() => {
    fetchLatestPattern();
  }, []);

  const fetchLatestPattern = async () => {
    try {
      const res = await fetch("/api/analyze/pattern");
      const data = await res.json();
      if (data && !data.error) {
        setPatternData(data);
      }
    } catch (e) {
      console.error("Failed to fetch pattern:", e);
    }
  };

  const handlePatternAnalyze = async () => {
    try {
      setIsPatternAnalyzing(true);
      const res = await fetch("/api/analyze/pattern", { method: "POST" });
      if (!res.ok) throw new Error("Analysis failed");

      const newData = await res.json();
      setPatternData(newData);
      toast.success("면접 패턴 분석이 완료되었습니다.");
    } catch (error) {
      console.error("Pattern Analysis Error:", error);
      toast.error("패턴 분석 중 오류가 발생했습니다.");
    } finally {
      setIsPatternAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">면접 패턴 분석</h2>
          <p className="text-sm text-gray-500 mt-1">
            누적된 면접 데이터를 기반으로 빈출 질문과 경향을 분석합니다.
          </p>
        </div>
        <CommonButton
          onClick={handlePatternAnalyze}
          disabled={isPatternAnalyzing}
          className="py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {isPatternAnalyzing ? "분석 중..." : "패턴 분석 실행"}
        </CommonButton>
      </div>

      {patternData ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📊 전체 면접 경향
            </h3>
            <p className="text-blue-800 leading-relaxed">
              {patternData.analysis_result.overall_trend}
            </p>
            <p className="text-xs text-blue-400 mt-4 text-right">
              분석된 면접 수: {patternData.total_interviews}건 | 최근 업데이트:{" "}
              {new Date(patternData.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patternData.analysis_result.patterns.map((pattern, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                    {pattern.interview_type}
                  </h3>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    핵심 키워드
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    빈출 질문 TOP 5
                  </p>
                  <ul className="space-y-3">
                    {pattern.frequent_questions.map((fq: any, fIdx) => (
                      <li key={fIdx} className="text-sm group">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="font-medium text-gray-800">
                            Q. {fq.question_jp}
                          </p>
                          {fq.occurrence_count && (
                            <span className="shrink-0 px-2 py-0.5 bg-white text-red-600 text-[10px] font-bold rounded-full border border-red-100">
                              {fq.occurrence_count}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs pl-2 border-l-2 border-gray-200 group-hover:border-indigo-300 transition-colors">
                          {fq.summary_ko}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">
            아직 분석된 데이터가 없습니다.
            <br />
            패턴 분석 실행 버튼을 눌러주세요.
          </p>
        </div>
      )}
    </div>
  );
};
