/** 면접 질문 빈도 */
export type FrequentQuestionsType = {
  question_jp: string;
  summary_ko: string;
  occurrence_count: string;
};

/** 면접 패턴 */
export type InterviewPatternType = {
  interview_type: string;
  keywords: string[];
  frequent_questions: FrequentQuestionsType[];
};

/** 면접 패턴 분석 결과 */
export type PatternAnalysisResultType = {
  id: string;
  created_at: string;
  total_interviews: number;
  analysis_result: {
    overall_trend: string;
    patterns: InterviewPatternType[];
  };
};

/** 면접 분석 상세 데이터 */
export type QAEntryType = {
  id: string;
  question_type: "면접관" | "역질문";
  question_jp: string;
  question_ko: string;
  answer_jp: string;
  answer_ko: string;
  feedback_ko: string;
  best_answer_jp: string;
};

/** 면접 스크립트 분석 결과 */
export type AnalysisResultType = {
  company_id?: string;
  company_name: string;
  company_type: string;
  interview_type: string;
  recorded_at: string;
  interview_date: string;
  duration: string;
  summary: string;
  qa_data: QAEntryType[];
};

/** 면접 데이터 */
export type InterviewType = AnalysisResultType & {
  id: string;
  raw_text: string;
  created_at?: string;
};

export type InterviewListType = Pick<
  InterviewType,
  | "id"
  | "company_name"
  | "company_type"
  | "interview_type"
  | "recorded_at"
  | "interview_date"
  | "duration"
  | "company_id"
>[];

export const COMPANY_TYPES = ["SIer", "자사서비스", "SES"] as const;

export const INTERVIEW_STATUS_TYPES = [
  "서류전형",
  "캐주얼면담",
  "1차면접",
  "2차면접",
  "3차면접",
  "처우협의",
] as const;

export const INTERVIEW_RESULT_TYPES = [
  "대기중",
  "합격",
  "탈락",
  "합격(입사)",
  "중도포기",
] as const;

export const APPLICATION_METHODS_TYPES = [
  "직접지원",
  "스카우트",
  "지인추천",
  "헤드헌터",
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number];
export type InterviewStatusType = (typeof INTERVIEW_STATUS_TYPES)[number];
export type InterviewResultType = (typeof INTERVIEW_RESULT_TYPES)[number];
export type ApplicationMethodType = (typeof APPLICATION_METHODS_TYPES)[number];

export type HistoryEntryType = {
  status: InterviewStatusType;
  result: InterviewResultType;
  date: string;
};

export type CompanyTableType = {
  id: string;
  name: string;
  type: CompanyType;
  /** 구인공고 url */
  jd_url?: string;
  /** 홈페이지 url */
  homepage_url?: string;
  /** 회사 주소 */
  address?: string;
  /** 지원 방법 */
  application_method: ApplicationMethodType;
  /** 지원 경로 */
  channel?: string;
  /** 지원일 */
  applied_at: string;
  /** 기업 정보 */
  info?: string;
  /** 지원동기 */
  motivation?: string;
  /** 다음 전형 일정 */
  next_step_date: string | null;
  /** 화상 면접 링크 */
  meeting_url?: string;
  /** 상태 */
  status: InterviewStatusType;
  /** 결과 */
  result: InterviewResultType;
  /** 상태 누적 */
  history: HistoryEntryType[];
  created_at: string;
  updated_at: string;
};

export type InterviewSetType = {
  id: string;
  company_id: string;
  title: string;
  /** 다음 면접 예정일 */
  scheduled_at?: string;
  /** 화상 면접 링크 */
  meeting_url?: string;
  /** 상태 태그 */
  status_tag: InterviewStatusType;
  created_at: string;
  updated_at: string;
};

/** 공통 질문 타입 */
export type BaseQnAType = {
  id: string;
  question: string;
  answer: string;
  category: string;
  ai_feedback?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// 1. 공통 질문용 (set_id가 없음)
export type CommonQuestionType = BaseQnAType;

// 2. 회사별 상세 질문용 (set_id가 필수)
export type QnAItemType = BaseQnAType & {
  set_id: string;
};

export type CreateCompanyInput = Omit<
  CompanyTableType,
  "id" | "created_at" | "updated_at"
>;
export type CreateQnAInput = Omit<
  QnAItemType,
  "id" | "created_at" | "updated_at"
>;
