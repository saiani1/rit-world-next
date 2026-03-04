"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import toast from "react-hot-toast";

import { useRouter } from "i18n/routing";
import { InterviewItem } from "features/Interview";
import { InterviewListType, isStatusPending } from "entities/interview";

type IntervieListProps = {
  data: InterviewListType;
};

export const InterviewList = ({ data }: IntervieListProps) => {
  const router = useRouter();
  const [filterType, setFilterType] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const uniqueTypes = useMemo(() => {
    const types = new Set(data?.map((item) => item.interview_type) || []);
    return ["All", ...Array.from(types)];
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterType === "All") return data;
    return data?.filter((item) => item.interview_type === filterType);
  }, [data, filterType]);

  const hasPendingItems = useMemo(
    () => data?.some((item) => isStatusPending(item.status)),
    [data]
  );

  const prevPendingDataRef = useRef<{ id: string; companyName: string }[]>([]);

  useEffect(() => {
    if (!data) return;

    // 현재 렌더링된 데이터에서 pending 상태인 항목들 추출
    const currentPendingData = data
      .filter((item) => isStatusPending(item.status))
      .map((item) => ({ id: item.id, companyName: item.company_name || "" }));

    // 이전 렌더링에서 pending이었던 항목 중 현재 pending이 아닌 항목 찾기
    prevPendingDataRef.current.forEach((prevItem) => {
      const currentItem = data.find((item) => item.id === prevItem.id);

      if (currentItem && !isStatusPending(currentItem.status)) {
        const companyName = currentItem.company_name || "진행된 면접";
        if (currentItem.status === "failed") {
          toast.error(`${companyName} 분석에 실패했습니다.`);
        } else {
          toast.success(`${companyName} 분석이 완료되었습니다.`);
        }
      }
    });

    // 참조 업데이트
    prevPendingDataRef.current = currentPendingData;
  }, [data]);

  useEffect(() => {
    if (!hasPendingItems) return;

    const interval = setInterval(() => {
      router.refresh(); // 이 호출로 page 컴포넌트가 서버에서 데이터를 다시 가져와 data prop이 변경됩니다.
    }, 5000);

    return () => clearInterval(interval);
  }, [hasPendingItems, router]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filterType]);

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
  }, [filteredData, filterType]);

  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {visibleData?.length > 0 ? (
          <>
            {visibleData.map((item) => (
              <InterviewItem key={item.id} item={item} />
            ))}
            {visibleCount < (filteredData?.length || 0) && (
              <div
                ref={observerRef}
                className="h-20 w-full flex justify-center items-center py-4"
              >
                {isLoadingMore && (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            )}
          </>
        ) : (
          <li className="text-center py-10 text-gray-500">
            등록된 면접 기록이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
};
