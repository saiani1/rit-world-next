import { AnalysisStatusType } from "../model/type";

export const isStatusPending = (status: AnalysisStatusType): boolean => {
  return status === "pending" || status === "processing";
};
