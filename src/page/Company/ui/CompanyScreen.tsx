"use client";
import { useEffect, useState } from "react";

import { Link, useRouter } from "i18n/routing";
import { CompanyTableType } from "entities/interview";
import { CommonButton } from "shared/ui";

type CompanyScreenProps = {
  companies: Pick<
    CompanyTableType,
    "id" | "name" | "type" | "applied_at" | "status" | "result"
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
                <li
                  key={company.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`company/${company.id}`}
                    className="flex justify-between items-start p-6 w-full h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          {company.type}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">
                          {company.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        지원일:{" "}
                        {new Date(company.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                        {company.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {company.result}
                      </span>
                    </div>
                  </Link>
                </li>
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
