"use client";
import { useEffect, useState } from "react";

import { useRouter } from "i18n/routing";
import { CompanyTableType } from "entities/interview";
import { CommonButton } from "shared/ui";
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
  const [showRejectedCompanies, setShowRejectedCompanies] = useState(false);

  const handleRegisterClick = () => {
    router.push("company/new");
  };

  const getCompanyStatusInfo = (company: Partial<CompanyTableType>) => {
    const latestResult =
      company.history && company.history.length > 0
        ? company.history[company.history.length - 1].result
        : company.result;
    const isRejected = latestResult === "탈락";
    return { latestResult, isRejected };
  };

  const companiesWithStatus = companies.map((company) => ({
    ...company,
    ...getCompanyStatusInfo(company),
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalCompanies = companiesWithStatus.length;
  let inProgressCompanies = 0;
  let rejectedCompanies = 0;

  companiesWithStatus.forEach((company) => {
    if (company.latestResult === "대기중") {
      inProgressCompanies++;
    }
    if (company.latestResult === "탈락") {
      rejectedCompanies++;
    }
  });

  const filteredCompanies = companiesWithStatus.filter((company) => {
    if (showRejectedCompanies) {
      return true;
    }
    return !company.isRejected;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aIsRejected = a.isRejected;
    const bIsRejected = b.isRejected;

    if (aIsRejected && !bIsRejected) return 1;
    if (!aIsRejected && bIsRejected) return -1;
    return 0;
  });

  return (
    <>
      {isMounted && (
        <div className="space-y-6">
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
              <div>
                <p className="text-sm text-gray-500">전형 진행중</p>
                <p className="text-2xl font-bold text-blue-600">
                  {inProgressCompanies}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">전형 탈락</p>
                <p className="text-2xl font-bold text-red-600">
                  {rejectedCompanies}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRejectedCompanies}
                onChange={(e) => setShowRejectedCompanies(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              전형탈락회사 보기
            </label>
          </div>

          <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
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
              className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              새 회사 등록하기
            </CommonButton>
          </div>

          {sortedCompanies.length > 0 ? (
            <ul className="grid gap-4">
              {sortedCompanies.map((company) => (
                <CompanyItem key={company.id} data={company} />
              ))}
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
