import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      당신은 일본어 교육 및 어휘 분석 전문가입니다.
      제공된 일본어 텍스트(블로그 본문)를 분석하여, 외국인(한국인) 일본어 학습자 관점에서 학습 가치가 있거나 어렵다고 여겨지는 중요한 일본어 어휘(한자어, 주요 명사/동사, 비즈니스 어휘 등)를 추출하고 정리해주세요.

      요구사항:
      1. 본문 텍스트 내에서 중요하거나 난이도가 있는 일본어 단어들을 5개에서 최대 15개 사이로 추출하세요.
      2. 각 단어는 반드시 '일본어 표기(한자가 있을 경우 한자 표기)', '요미가나(히라가나)', '정확한 한국어 의미' 세 가지 정보를 가지고 있어야 합니다.
      3. 오직 순수 JSON 형식의 배열 데이터만 반환하세요. 마크다운 코드 블록이나 기타 텍스트 설명은 절대 포함하지 마세요.

      응답 JSON 스키마 형식:
      [
        {
          "word": "일본어 표기 (예: 概念)",
          "reading": "요미가나 (예: がいねん)",
          "meaning": "한국어 의미 (예: 개념)"
        }
      ]

      분석할 일본어 본문 텍스트:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();
    const vocabularyList = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data: vocabularyList });
  } catch (error: any) {
    console.error("Error during vocabulary analysis:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze vocabulary." },
      { status: 500 }
    );
  }
}
