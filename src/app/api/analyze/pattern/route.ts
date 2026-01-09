import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  getInterviewPattern,
  saveInterviewPattern,
  getAllInterviews,
} from "entities/interview";

export const maxDuration = 300;

export const POST = async () => {
  console.log("--- Pattern Analysis API Request Started ---");

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing Env Vars:", {
        hasApiKey: !!apiKey,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Supabase에서 모든 면접 데이터 가져오기
    let interviews;
    try {
      interviews = await getAllInterviews();
    } catch (error: any) {
      console.error("Error fetching interviews:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!interviews || interviews.length === 0) {
      return NextResponse.json(
        { error: "No interview data found to analyze" },
        { status: 404 }
      );
    }

    // 2. 데이터 전처리
    const processedData = interviews
      .map((item: any) => {
        let qaData = item.qa_data;
        if (!qaData) return null;

        // qa_data가 문자열(JSON)인 경우 파싱
        if (typeof qaData === "string") {
          try {
            qaData = JSON.parse(qaData);
          } catch (e) {
            return null;
          }
        }

        // 만약 qa_data 컬럼 안에 전체 JSON 객체가 들어있어서 한번 더 들어가야 하는 경우 대응
        if (!Array.isArray(qaData) && qaData.qa_data) {
          qaData = qaData.qa_data;
        }

        if (!Array.isArray(qaData)) return null;

        return {
          type: item.interview_type || "미정",
          qa:
            qaData
              .filter((qa: any) => qa.question_type !== "역질문") // 역질문 제외
              .map((qa: any) => ({
                q: qa.question_jp, // 질문만 추출
              })) || [],
        };
      })
      .filter(Boolean); // null 값 제거

    if (processedData.length === 0) {
      return NextResponse.json(
        { error: "No valid interview data to analyze" },
        { status: 404 }
      );
    }

    console.log(`Analyzing ${processedData.length} interviews...`);

    // 3. Gemini 모델 설정
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // 4. 프롬프트 작성
    const prompt = `
      아래 데이터는 여러 건의 일본어 면접 기록입니다.
      이 데이터를 '면접 유형(type)'별로 그룹화하여 분석하고, 다음 JSON 형식으로 출력해주세요.

      [요구사항]
      1. 면접 유형(예: 1차 면접, 2차 면접, 최종 면접 등)별로 그룹화하세요.
      2. 각 유형별로 가장 자주 나오는 질문(frequent_questions) TOP 5를 뽑아주세요.
         - 질문의 문장이 완전히 똑같지 않더라도, 의미가 유사하면 같은 질문으로 간주하여 카운트하세요.
         - 반드시 데이터에 기반하여 실제로 2회 이상 등장한 질문 위주로 선정하세요.
         - 'occurrence_count' 필드에 해당 질문이 총 몇 개의 면접에서 등장했는지 횟수를 명시하세요 (예: "3회").
      3. 각 유형별로 면접관이 중요하게 생각하는 핵심 키워드(keywords)를 5개 추출하세요.
      4. 전체적인 면접 경향(overall_trend)을 한국어로 한 문단 요약하세요.

      [출력 JSON 구조]
      {
        "overall_trend": "전체적인 경향 요약 (한국어)",
        "patterns": [
          {
            "interview_type": "1차 면접",
            "frequent_questions": [
              { "question_jp": "...", "summary_ko": "...", "occurrence_count": "N회" }
            ],
            "keywords": ["...", "..."]
          }
        ]
      }

      [데이터]
      ${JSON.stringify(processedData)}
    `;

    // 5. AI 분석 요청
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const cleanedJsonString = textResponse.replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(cleanedJsonString);

    // 6. 결과 저장 (interview_patterns 테이블)
    let savedData;
    try {
      savedData = await saveInterviewPattern(
        processedData.length,
        analysisResult
      );
    } catch (saveError) {
      console.error("Error saving pattern analysis:", saveError);
      throw saveError;
    }

    return NextResponse.json(savedData);
  } catch (error: any) {
    console.error("Pattern Analysis Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    let clientMessage = "Internal Server Error";
    let status = 500;

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests") ||
      errorMessage.includes("Quota exceeded")
    ) {
      clientMessage =
        "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
      status = 429;
    } else if (
      errorMessage.includes("404") ||
      errorMessage.includes("NOT_FOUND")
    ) {
      clientMessage = "요청한 AI 모델을 찾을 수 없습니다.";
      status = 404;
    }

    return NextResponse.json(
      { error: clientMessage, details: errorMessage },
      { status: status }
    );
  }
};

// 최신 분석 결과 조회용 GET
export const GET = async () => {
  try {
    const data = await getInterviewPattern();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
