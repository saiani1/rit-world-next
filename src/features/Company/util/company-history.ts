import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  CompanyTableType,
  HistoryEntryType,
  InterviewResultType,
  InterviewStatusType,
} from "entities/interview";

dayjs.extend(customParseFormat);

type UpdateCompanyHistoryParams = {
  company: CompanyTableType;
  newStatus: InterviewStatusType;
  newResult: InterviewResultType;
  // Optional date sources based on the context
  sourceAppliedAt?: string; // For "서류단계"
  sourceInterviewDate?: string; // For "면접 분석 단계" (e.g., from ClovaNote .txt)
  sourceNotificationDate?: string; // For "결과 통보" (user input or current date)
};

/**
 * 회사의 상태 변경 이력을 history 배열에 추가하고, 현재 상태/결과를 업데이트합니다.
 * 날짜 매핑 규칙을 준수하여 이력을 기록합니다.
 *
 * @param {UpdateCompanyHistoryParams} params - 업데이트에 필요한 파라미터
 * @returns {CompanyTableType} 업데이트된 회사 객체
 */
export const updateCompanyHistory = ({
  company,
  newStatus,
  newResult,
  sourceAppliedAt,
  sourceInterviewDate,
  sourceNotificationDate,
}: UpdateCompanyHistoryParams): CompanyTableType => {
  const currentHistory = company.history || [];

  let entryDate: string;

  // 1. Determine the date based on the rules
  if (newStatus === "서류단계" && sourceAppliedAt) {
    // Use applied_at for "서류단계"
    entryDate = dayjs(sourceAppliedAt).toISOString();
  } else if (
    (newStatus === "1차면접" ||
      newStatus === "2차면접" ||
      newStatus === "3차면접" ||
      newStatus === "캐주얼면담") &&
    sourceInterviewDate
  ) {
    // Use interview_date from analysis for interview stages
    // Assuming sourceInterviewDate is in YYYY.MM.DD format
    entryDate = dayjs(sourceInterviewDate, "YYYY.MM.DD").toISOString();
  } else if (
    newResult === "합격" ||
    newResult === "탈락" ||
    newResult === "합격(입사)" ||
    newResult === "중도포기"
  ) {
    // For result updates, use provided notificationDate or current date
    entryDate = sourceNotificationDate
      ? dayjs(sourceNotificationDate).toISOString()
      : dayjs().toISOString();
  } else {
    // Fallback: use current date if no specific date source is provided or applicable
    entryDate = dayjs().toISOString();
  }

  const newHistoryEntry: HistoryEntryType = {
    status: newStatus,
    result: newResult,
    date: entryDate,
  };

  // 2. Avoid adding duplicate entries (same status, result, and date up to the day)
  const isDuplicate = currentHistory.some(
    (entry) =>
      entry.status === newHistoryEntry.status &&
      entry.result === newHistoryEntry.result &&
      dayjs(entry.date).isSame(newHistoryEntry.date, "day")
  );

  if (isDuplicate) {
    // If a duplicate entry exists, return the company object with only its current status/result updated.
    // This ensures the main status/result fields reflect the latest state even if history entry is redundant.
    return {
      ...company,
      status: newStatus,
      result: newResult,
    };
  }

  // 3. Add the new entry and sort
  const updatedHistory = [...currentHistory, newHistoryEntry];

  // Sort by date in ascending order
  updatedHistory.sort(
    (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
  );

  return {
    ...company,
    status: newStatus,
    result: newResult,
    history: updatedHistory,
  };
};
