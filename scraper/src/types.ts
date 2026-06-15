export type Job = {
  platform: string; // 예: 'saramin'
  companyName: string; // 회사명
  title: string; // 공고 제목
  url: string; // 상세 페이지 URL
  postedAt: string; // 등록일 (예: '2026-06-14' 또는 '6시간 전' 등 원본 텍스트 및 파싱본)
};

export type JobProvider = {
  platform: string;
  getJobsByKeywords(keywords: string[]): Promise<Job[]>;
  fetchJobDetail(url: string): Promise<{ text: string; imageUrls: string[] }>;
};
