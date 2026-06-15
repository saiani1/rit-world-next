export const applyRecommendation = async (
  companyName: string,
  jdUrl: string,
  platform: string
): Promise<{ success: boolean; error?: string }> => {
  const res = await fetch("/api/recommendations/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyName, jdUrl, platform }),
  });
  return res.json();
};
