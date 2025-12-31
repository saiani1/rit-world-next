import { NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";

export const POST = async (req: Request) => {
  console.log("--- Analyze API Request Started (Vertex AI) ---");

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_LOCATION || "us-central1";

    if (!projectId) {
      console.error("Error: GCP_PROJECT_ID is not set");
      return NextResponse.json(
        { error: "Server configuration error: Missing Project ID" },
        { status: 500 }
      );
    }

    // Vertex AI 초기화 옵션
    const vertexInitOptions: any = { project: projectId, location: location };

    // 환경 변수에 서비스 계정 키 JSON이 있다면 사용 (로컬/배포 환경 인증 해결)
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
      console.log(
        "GOOGLE_SERVICE_ACCOUNT_JSON found. Length:",
        serviceAccountJson.length
      );
      try {
        vertexInitOptions.googleAuthOptions = {
          credentials: JSON.parse(serviceAccountJson),
        };
        console.log("Credentials parsed successfully.");
      } catch (e) {
        console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
      }
    } else {
      console.warn(
        "GOOGLE_SERVICE_ACCOUNT_JSON is not set. Using default auth (gcloud)."
      );
    }

    const vertex_ai = new VertexAI(vertexInitOptions);

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

    const modelName = "gemini-2.5-pro";
    console.log(`Using Vertex AI Model: ${modelName}`);
    const model = vertex_ai.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 16384,
      },
    });

    const prompt = `
      당신은 일본어 면접 분석 전문가입니다. 아래 제공된 텍스트는 클로바노트에서 추출한 면접 녹음 기록입니다.
      이 텍스트를 분석하여 다음 JSON 형식으로 출력해주세요. 마크다운 코드 블록 없이 순수 JSON 문자열만 반환하세요.
      중요: 출력 길이가 길어질 수 있으므로, 각 답변과 피드백은 핵심만 간결하게 작성하여 JSON 형식이 끊기지 않도록 하세요.

      요구사항:
      1. 텍스트 상단의 메타데이터(날짜, 시간, 길이)를 파싱하여 필드에 채우세요.
      2. 면접 내용을 분석하여 회사명과 면접 유형(1차, 2차 등)을 추론하세요. 면접 유형은 반드시 한국어로 출력하세요. 알 수 없으면 "미정"으로 하세요.
      3. 면접 내용을 바탕으로 회사의 사업 형태(SES, SIer, 자사서비스 등)를 추론하여 company_type에 작성하세요.
      4. 전체 내용을 요약하여 summary에 작성하세요.
      5. 대화 내용을 분석하여 질문과 답변 쌍으로 분리하고 qa_data 배열에 담으세요.
      6. 각 항목이 면접관의 질문인지, 지원자의 역질문인지 판단하여 question_type에 "면접관" 또는 "역질문"으로 표기하세요.
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

    console.log("Sending request to Vertex AI...");
    const result = await model.generateContent(prompt);
    console.log("Vertex AI response received.");

    const response = await result.response;
    const textResponse = response.candidates?.[0].content.parts?.[0].text || "";
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
        "Google Cloud Console에서 Vertex AI API를 활성화하거나 인증 권한을 확인해야 합니다.";
    } else if (
      errorMessage.includes("404") ||
      errorMessage.includes("NOT_FOUND")
    ) {
      clientMessage = "요청한 AI 모델을 찾을 수 없습니다. (모델명 오류)";
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
