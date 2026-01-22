import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MAX_DURATION } from "shared/config/constants";

export const maxDuration = MAX_DURATION;

export const POST = async (req: Request) => {
  console.log("--- Analyze API Request Started (Gemini API) ---");

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Error: GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error: Missing API Key" },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { text } = body;

    if (!text) {
      console.error("Error: No text provided");
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    console.log(`Text received. Length: ${text.length} characters.`);

    const modelName = "gemini-flash-latest";
    console.log(`Using Gemini Model: ${modelName}`);
    const model = genAI.getGenerativeModel({
      model: modelName,
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

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    console.log("Gemini API response received.");

    const response = await result.response;
    const textResponse = response.text();
    console.log("Raw response text length:", textResponse.length);

    // JSON 파싱 (마크다운 코드 블록이 포함될 경우 제거)
    let jsonString = textResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 혹시 모를 앞뒤 잡다한 텍스트 제거 (첫 '{' 부터 시작)
    const firstBrace = jsonString.indexOf("{");
    if (firstBrace !== -1) {
      jsonString = jsonString.substring(firstBrace);
    }

    // 파싱 에러 발생 시 상세 로그 출력 후 500 반환
    try {
      const data = JSON.parse(jsonString);
      console.log("JSON parsing successful.");
      return NextResponse.json(data);
    } catch (parseError) {
      console.warn("JSON Parsing failed, attempting repair...");
      // JSON이 잘렸을 경우 복구 시도 (닫는 괄호 추가)
      try {
        // qa_data 배열 내부 객체에서 끝난 경우 (가장 흔한 케이스)
        if (jsonString.trim().endsWith("}")) {
          const repaired = jsonString + "]}";
          const data = JSON.parse(repaired);
          console.log("JSON repaired with ']}'");
          return NextResponse.json(data);
        }
      } catch (e) {
        console.error("Repair failed:", e);
      }

      console.error("JSON Parsing Error:", parseError);
      console.error("Failed JSON String:", jsonString);
      return NextResponse.json(
        { error: "JSON Parsing Failed", raw_response: textResponse },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.log("!!! Analysis Error Occurred !!!");
    console.error("Unhandled Analysis Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    let clientMessage = errorMessage;
    if (
      errorMessage.includes("403") ||
      errorMessage.includes("PERMISSION_DENIED")
    ) {
      clientMessage =
        "Google AI Studio API Key가 유효하지 않거나 권한이 없습니다.";
    } else if (
      errorMessage.includes("404") ||
      errorMessage.includes("NOT_FOUND")
    ) {
      clientMessage = "요청한 AI 모델을 찾을 수 없습니다. (모델명 오류)";
    } else if (
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests") ||
      errorMessage.includes("Quota exceeded")
    ) {
      clientMessage =
        "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: clientMessage,
        raw_error: errorMessage,
      },
      { status: 500 }
    );
  }
};
