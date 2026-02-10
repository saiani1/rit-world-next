"use client";
import { useEffect, useRef, useState } from "react";

import { useRouter } from "i18n/routing";
import {
  CompanyTableType,
  INTERVIEW_STATUS_TYPES,
  InterviewStatusType,
} from "entities/interview";
import { CommonButton, CommonInput } from "shared/ui";
import { CompanyItem } from "./CompanyItem";

type CompanyScreenProps = {
  companies: Pick<
    CompanyTableType,
    | "id"
    | "name"
    | "type"
    | "applied_at"
    | "status"
    | "result"
    | "history"
    | "next_step_date"
  >[];
};

export const CompanyScreen = ({ companies }: CompanyScreenProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "FINISHED">("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleRegisterClick = () => {
    router.push("company/new");
  };

  const getCompanyStatusInfo = (
    company: Pick<CompanyTableType, "status" | "result" | "history">
  ) => {
    const latestResult =
      company.history && company.history.length > 0
        ? company.history[company.history.length - 1].result
        : company.result;
    const latestStatus =
      company.history && company.history.length > 0
        ? company.history[company.history.length - 1].status
        : company.status;
    const isRejected = latestResult === "탈락";

    return {
      latestResult,
      latestStatus,
      isRejected,
      isInProgress: !isRejected,
    };
  };

  const companiesWithStatus = companies.map((company) => ({
    ...company,
    ...getCompanyStatusInfo(company),
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const progressStatusesToDisplay = INTERVIEW_STATUS_TYPES;

  const totalCompanies = companiesWithStatus.length;
  let totalInProgressSummary = 0;
  let rejectedCompanies = 0;
  const statusCounts: Record<InterviewStatusType, number> = Object.fromEntries(
    progressStatusesToDisplay.map((status) => [status, 0])
  ) as Record<InterviewStatusType, number>;

  companiesWithStatus.forEach((company) => {
    if (company.isRejected) {
      rejectedCompanies++;
    }

    if (company.isInProgress) {
      totalInProgressSummary++;
      if (progressStatusesToDisplay.includes(company.latestStatus)) {
        statusCounts[company.latestStatus]++;
      }
    }
  });

  const filteredCompanies = companiesWithStatus.filter((company) => {
    if (searchTerm) {
      return company.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (activeTab === "FINISHED") {
      return company.isRejected;
    }
    return !company.isRejected;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
  });

  useEffect(() => {
    setVisibleCount(10);
  }, [activeTab]);

  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMoreRef.current) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 10);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [sortedCompanies, activeTab]);

  const visibleCompanies = sortedCompanies.slice(0, visibleCount);

  return (
    <>
      {isMounted && (
        <div className="space-y-6">
          <div className="flex justify-between items-center rounded-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                등록된 회사 목록
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                지원한 회사들의 전형 현황을 관리합니다.
              </p>
            </div>
            <CommonButton
              onClick={handleRegisterClick}
              className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors break-keep"
            >
              회사 등록
            </CommonButton>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              전형 현황 요약
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">총 회사</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalCompanies}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500">전형 진행중</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {totalInProgressSummary}
                </p>
                {totalInProgressSummary > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 w-full">
                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                      {progressStatusesToDisplay.map(
                        (status) =>
                          (statusCounts[status] || 0) > 0 && (
                            <div
                              key={status}
                              className="flex items-center gap-x-1 px-1.5 py-0.5 bg-gray-50 rounded-md text-xs"
                            >
                              <p className="text-xs text-gray-600">{status}</p>
                              <p className="text-sm font-bold text-blue-500">
                                {statusCounts[status] || 0}
                              </p>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">전형 탈락</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedCompanies}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row border-b border-gray-200 justify-between items-start sm:items-end gap-y-2">
            {searchTerm ? (
              <div className="flex items-center gap-4 py-3">
                <p className="text-gray-900 font-medium">
                  &quot;{searchTerm}&quot; 검색 결과
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({sortedCompanies.length}건)
                  </span>
                </p>
                <CommonButton
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                  목록으로 돌아가기
                </CommonButton>
              </div>
            ) : (
              <div className="flex -mb-px">
                <CommonButton
                  onClick={() => setActiveTab("ACTIVE")}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "ACTIVE"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  진행 중인 기업
                </CommonButton>
                <CommonButton
                  onClick={() => setActiveTab("FINISHED")}
                  className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "FINISHED"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  탈락한 기업
                </CommonButton>
              </div>
            )}
            <div className="py-2 w-full sm:w-auto">
              <CommonInput
                placeholder="회사 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          {sortedCompanies.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {visibleCompanies.map((company) => (
                <CompanyItem key={company.id} data={company} />
              ))}
              {visibleCount < sortedCompanies.length && (
                <div
                  ref={observerRef}
                  className="h-20 w-full flex justify-center items-center py-4"
                >
                  {isLoadingMore && (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )}
            </ul>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">
                등록된 회사 데이터가 없습니다.
                <br />새 회사 등록하기 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
