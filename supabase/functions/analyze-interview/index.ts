// deno-lint-ignore-file
// @ts-nocheck
import { serve } from "std/http/server.ts";
import { createClient } from "supabase";
import { GoogleGenerativeAI } from "google-generative-ai";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  try {
    const { record } = await req.json();
    const interviewId = record.id;
    const text = record.raw_text;

    console.log(`Starting analysis for interview: ${interviewId}`);

    // 1. 상태를 processing으로 변경
    await supabase
      .from("interviews")
      .update({ status: "processing" })
      .eq("id", interviewId);

    // 2. Gemini API 호출
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      당신은 일본어 면접 분석 전문가입니다. 아래 제공된 텍스트는 클로바노트에서 추출한 면접 녹음 기록입니다.
      이 텍스트를 분석하여 다음 JSON 형식으로 출력해주세요. 마크다운 코드 블록 없이 순수 JSON 문자열만 반환하세요.
      중요: 출력 길이가 길어질 수 있으므로, 각 답변과 피드백은 핵심만 간결하게 작성하여 JSON 형식이 끊기지 않도록 하세요.

      요구사항:
      1. 텍스트 파일의 맨 첫 번째 줄에 있는 날짜 정보를 '녹음 일시'로 사용하여 recorded_at과 interview_date 필드를 채우세요. 두 번째 줄에 있는 날짜 정보는 클로바노트 파싱일이므로 무시하세요.
      2. 면접 내용을 분석하여 회사명과 면접 유형을 추론하세요. 면접 유형은 **반드시** '캐주얼 면담', '1차 면접', '2차 면접', '3차 면접', '처우 협의' 중 하나로 한국어로 출력하세요. 알 수 없으면 "미정"으로 하세요.
      3. 면접 내용을 바탕으로 회사의 사업 형태(SES, SIer, 자사서비스 등)를 추론하여 company_type에 작성하세요.
      4. 전체 내용을 요약하여 summary에 작성하세요.
      5. 대화 내용을 분석하여 질문과 답변 쌍으로 분리하고 qa_data 배열에 담으세요. 이때, AI의 주관적인 판단 없이 모든 질문과 답변을 정리하고, 요약하지 않고 원문 그대로 기재하세요.
      6. 각 항목이 면접관의 질문인지, 지원자의 역질문인지 판단하여 question_type 필드에 **반드시** '면접관' 또는 '역질문' 중 하나로 **한국어로** 표기하세요.
      7. "면접관" 유형일 경우:
         - question_jp: 면접관의 질문
         - answer_jp: 지원자의 답변
         - feedback_ko: 지원자의 답변에 대한 피드백 (한국어)
         - best_answer_jp: 더 나은 답변 제안 (정중한 일본어)
      8. "역질문" 유형일 경우:
         - question_jp: 지원자의 질문
         - answer_jp: 면접관의 답변
         - feedback_ko: 지원자의 질문이 적절했는지에 대한 피드백 (한국어)
         - best_answer_jp: 더 정중하거나 좋은 질문 표현 제안 (정중한 일본어)
      9. 모든 한국어 번역 필드(_ko)를 채우세요.

      출력 JSON 구조:
      {
        "company_name": "회사명",
        "company_type": "SES" | "SIer" | "자사서비스" | "기타",
        "interview_type": "면접 유형 (한국어)",
        "recorded_at": "녹음 일시 (텍스트 상단 정보)",
        "interview_date": "YYYY.MM.DD (녹음 일시 기반)",
        "duration": "00분 00초",
        "summary": "전체 요약",
        "qa_data": [
          {
            "id": "qa_1",
            "question_type": "면접관" 또는 "역질문",
            "question_jp": "질문 내용",
            "question_ko": "질문 한국어 번역",
            "answer_jp": "답변 내용",
            "answer_ko": "답변 한국어 번역",
            "feedback_ko": "피드백",
            "best_answer_jp": "개선된 답변 또는 질문"
          }
        ]
      }

      분석할 텍스트:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = jsonString.indexOf("{");
    if (firstBrace !== -1) {
      jsonString = jsonString.substring(firstBrace);
    }

    const analysisData = JSON.parse(jsonString);

    // 3. 분석 결과 업데이트 및 상태 완료 처리
    const { error: updateError } = await supabase
      .from("interviews")
      .update({
        ...analysisData,
        status: "completed",
      })
      .eq("id", interviewId);

    if (updateError) throw updateError;

    console.log(`Analysis completed for interview: ${interviewId}`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error during analysis:", error);

    // 에러 발생 시 상태를 failed로 변경
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
