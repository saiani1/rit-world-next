"use client";
import { useState, useMemo } from "react";

import { InterviewItem } from "features/Interview";
import { InterviewListType } from "entities/interview";

type IntervieListProps = {
  data: InterviewListType;
};

export const InterviewList = ({ data }: IntervieListProps) => {
  const [filterType, setFilterType] = useState("All");

  const uniqueTypes = useMemo(() => {
    const types = new Set(data?.map((item) => item.interview_type) || []);
    return ["All", ...Array.from(types)];
  }, [data]);

  const filteredData = useMemo(() => {
    if (filterType === "All") return data;
    return data?.filter((item) => item.interview_type === filterType);
  }, [data, filterType]);

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
        {filteredData?.length > 0 ? (
          filteredData.map((item) => (
            <InterviewItem key={item.id} item={item} />
          ))
        ) : (
          <li className="text-center py-10 text-gray-500">
            등록된 면접 기록이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
};
