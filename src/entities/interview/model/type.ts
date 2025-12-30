export interface QAEntry {
  id: string;
  question_jp: string;
  question_ko: string;
  answer_jp: string;
  answer_ko: string;
  feedback_ko: string;
  best_answer_jp: string;
}

export interface AnalysisResult {
  company_name: string;
  interview_type: string;
  recorded_at: string;
  interview_date: string;
  duration: string;
  summary: string;
  qa_data: QAEntry[];
}
