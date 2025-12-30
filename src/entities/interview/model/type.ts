export type QAEntryType = {
  id: string;
  question_jp: string;
  question_ko: string;
  answer_jp: string;
  answer_ko: string;
  feedback_ko: string;
  best_answer_jp: string;
};

export type AnalysisResultType = {
  company_name: string;
  interview_type: string;
  recorded_at: string;
  interview_date: string;
  duration: string;
  summary: string;
  qa_data: QAEntryType[];
};

export type InterviewType = AnalysisResultType & {
  id: string;
  raw_text: string;
  created_at?: string;
};

export type InterviewListType = Pick<
  InterviewType,
  | "id"
  | "company_name"
  | "interview_type"
  | "recorded_at"
  | "interview_date"
  | "duration"
>[];
