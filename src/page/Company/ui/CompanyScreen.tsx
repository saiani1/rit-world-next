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
    | "next_step_date"
  >[];
};

export const CompanyScreen = ({ companies }: CompanyScreenProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const handleRegisterClick = () => {
    router.push("company/new");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <div className="space-y-6">
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

          {companies.length > 0 ? (
            <ul className="grid gap-4">
              {companies.map((company) => (
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
