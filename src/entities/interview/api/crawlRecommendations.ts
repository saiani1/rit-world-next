export const crawlRecommendations = async (): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> => {
  const res = await fetch("/api/recommendations", {
    method: "POST",
  });
  return res.json();
};
