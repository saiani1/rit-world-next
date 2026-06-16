"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiExternalLink,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  JobRecommendation,
  getRecommendations,
  applyRecommendation,
  crawlRecommendations,
} from "entities/interview";
import { CommonButton } from "shared/ui";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  // 데이터 로드
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const result = await getRecommendations();
      if (result.success) {
        setRecommendations(result.data || []);
      } else {
        toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("데이터 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  // 지원 완료 등록 처리
  const handleApply = async (
    companyName: string,
    jdUrl: string,
    platform: string
  ) => {
    try {
      toast.loading("회사 정보 등록 중...", { id: "apply-toast" });
      const result = await applyRecommendation(companyName, jdUrl, platform);
      if (result.success) {
        toast.success("회사 정보가 등록되었습니다!", { id: "apply-toast" });
        fetchRecommendations(); // 리스트 갱신 (이미 등록된 회사는 리스트에서 제외됨)
      } else {
        toast.error(`등록 실패: ${result.error}`, { id: "apply-toast" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("등록 중 오류가 발생했습니다.", { id: "apply-toast" });
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // 브라우저 마운트 시점에 로컬 호스트네임 및 개발 모드 여부 감지
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsLocal(
        hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          process.env.NODE_ENV === "development"
      );
    }
  }, []);

  // 크롤링 & AI 분석 개시
  const handleCrawl = async () => {
    try {
      setCrawling(true);
      toast.loading(
        "사람인 최신 공고를 수집하고 AI 분석을 진행 중입니다...\n(약 10~30초 소요)",
        {
          id: "crawl-toast",
        }
      );
      const result = await crawlRecommendations();

      if (result.success) {
        toast.success(
          `크롤링 및 AI 분석 완료! (신규 ${result.count}건 분석됨)`,
          {
            id: "crawl-toast",
          }
        );
        fetchRecommendations(); // 리스트 갱신
      } else {
        toast.error(`작업 중 오류가 발생했습니다: ${result.error}`, {
          id: "crawl-toast",
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error("크롤러 가동 실패", { id: "crawl-toast" });
    } finally {
      setCrawling(false);
    }
  };

  // 적합도 점수 색상 반환
  const getScoreColor = (score: number) => {
    if (score >= 85)
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (score >= 70) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* 상단 컨트롤러 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
            🤖 AI 기반 맞춤형 채용 추천
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            설정된 이력 프로필을 기반으로 사람인의 최근 2일 내 공고를 분석하여
            추천합니다.
          </p>
        </div>
        {isLocal && (
          <CommonButton
            onClick={handleCrawl}
            disabled={crawling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
              crawling
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white hover:shadow-blue-500/10 hover:shadow-lg"
            }`}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${crawling ? "animate-spin" : ""}`}
            />
            {crawling ? "AI 분석 진행 중..." : "추천공고 크롤링하기"}
          </CommonButton>
        )}
      </div>

      {/* 리스트 출력 영역 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
          <FiRefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
            AI 추천 공고 분석 리스트를 불러오는 중입니다...
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500 text-lg">
            아직 수집 및 분석된 추천 공고가 없습니다.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            상단의 크롤링 버튼을 눌러 추천 공고를 수집해 보세요!
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {recommendations.map((job) => (
            <li
              key={job.id}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              {/* 상단 메타라인 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {job.postedAt}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {job.companyName}
                  </span>
                </div>

                {/* 매칭 스코어 및 중복 검증 배지 */}
                <div className="flex flex-wrap items-center gap-2">
                  {job.isAlreadyApplied && (
                    <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-rose-500/20">
                      지원 완료
                    </span>
                  )}
                  {job.isCompanyRegistered && !job.isAlreadyApplied && (
                    <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-indigo-500/20">
                      등록 기업
                    </span>
                  )}
                  <div
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${getScoreColor(job.finalScore)}`}
                  >
                    AI 적합도 {job.finalScore}점 {!job.aiScore && "(1차)"}
                  </div>
                  {job.recommend && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      AI 추천
                    </span>
                  )}
                </div>
              </div>

              {/* 공고 제목 및 링크 이동 */}
              <div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug flex-1 min-w-[200px]">
                  {job.title}
                </h3>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 지원 완료 버튼 */}
                  <CommonButton
                    onClick={() =>
                      handleApply(job.companyName, job.url, job.platform)
                    }
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    지원 완료
                  </CommonButton>
                  {/* 공고로 이동 버튼 */}
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
                  >
                    공고로 이동
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* AI 추천 이유 */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-500/10 mb-4">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  💡{" "}
                  {job.aiScore
                    ? "AI 상세 분석 리포트"
                    : "AI 1차 스크리닝 리포트"}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {job.reason || "상세 분석 이유가 제공되지 않았습니다."}
                </p>
              </div>

              {/* 매칭 키워드 및 매칭 강점 칩스 */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {/* 강점 뱃지 */}
                  {job.matchedStrengths &&
                    job.matchedStrengths.map((str, idx) => (
                      <span
                        key={`str-${idx}`}
                        className="text-xs font-bold px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-500/20"
                      >
                        ⭐ {str}
                      </span>
                    ))}
                  {/* 매칭 키워드 칩스 */}
                  {job.matchedKeywords &&
                    job.matchedKeywords.map((kw, idx) => (
                      <span
                        key={`kw-${idx}`}
                        className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                      >
                        #{kw}
                      </span>
                    ))}
                </div>

                {/* 경고 사항 표시 (있을 경우만) */}
                {job.warnings && job.warnings.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                    <FiAlertTriangle className="w-3.5 h-3.5" />
                    <span>{job.warnings[0]}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationsPage;
