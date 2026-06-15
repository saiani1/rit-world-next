import { JobRecommendation } from "../model/type";

export const getRecommendations = async (): Promise<{
  success: boolean;
  data?: JobRecommendation[];
  error?: string;
}> => {
  const res = await fetch("/api/recommendations");
  return res.json();
};
