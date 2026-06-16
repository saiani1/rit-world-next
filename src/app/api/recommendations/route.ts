import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "shared/api/server";
import crypto from "crypto";
import axios from "axios";

import { SaraminProvider } from "scraper/src/providers/SaraminProvider";

export const dynamic = "force-dynamic";

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
/**
 * 1차 일괄 AI 스크리닝: 수집된 전체 공고 목록을 1번의 API 호출로 스크리닝하여 점수와 사유를 반환합니다.
 */
const batchScreenJobs = async (
  jobs: Array<{ companyName: string; title: string }>
): Promise<Array<{ score: number; reason: string }>> => {
  if (jobs.length === 0) return [];

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json" },
  });

  const jobListForAi = jobs.map((job, idx) => ({
    index: idx,
    company: job.companyName,
    title: job.title,
  }));

  const profile = `
공고 분석을 위한 사용자 프로필:
- 직무: Frontend Engineer (프론트엔드 개발자)
- 기술 스택: React, Next.js, TypeScript, JavaScript, HTML, CSS
- 우대/강점: 비즈니스 일본어 가능, 일본계 기업, 일본 연관 업무 경험, UI/UX 관심, 스포츠 및 야구 관심.
`;

  const prompt = `
당신은 똑똑한 채용 추천 AI 조수입니다.
제공된 사용자 프로필과 채용 공고(회사명 및 제목) 목록을 비교하여, 사용자가 지원할 만한 직무인지를 1차적으로 스크리닝하여 0점부터 100점 사이의 점수(score)를 부여해 주세요.

[판단 기준 가이드라인]
1. 프론트엔드(React, Next.js, TypeScript, Javascript) 및 웹/앱 개발자 포지션은 높은 점수(80~100점)를 부여합니다.
2. 회사명이 일본계이거나 제목에 일본어/일본계가 포함된 경우(예: 일본어 번역, 일본 연관 일반 사무, 마케팅, 관리, 기획, 영업지원 직무)에는 높은 가점(60~90점)을 부여합니다. 사용자는 일본어를 사용하는 번역 및 일반 사무/관리/영업지원 업무에도 큰 관심이 있습니다. (중요: 단순 '영업(Sales)' 전용 직무는 배제해야 하며, '영업지원(Sales Support)' 직무는 정상적으로 허용하고 가점을 줍니다.)
3. 제목에 백엔드 기술(Java, Spring, Python 등)이 포함되어 있더라도 React/Next.js/프론트엔드 등이 함께 쓰여 있어 병행 업무 가능성이 있다면, 2차 상세 분석에서 검증할 수 있도록 50~80점 사이의 점수를 주어 합격권으로 올려주세요.
4. 단, 사무/개발/번역/디자인/영업지원과 아예 무관한 단순 영업(Sales) 직무, 단순 생산직(예: 반도체 화학재료 오퍼레이터, 클린룸 리더), 현장 노무직, 혹은 단순 매장 보조 및 현장 서비스직(예: 호텔 대고객 프론트 데스크 서비스직) 등은 0~15점 사이의 매우 낮은 점수를 주어 완전히 뒤로 밀어내야 합니다. (주의: "토요코인호텔 호텔 프론트"는 일본계 호텔이지만, 사무/번역/개발이 아닌 현장 서비스 직무이므로 0~15점으로 낮게 평가해야 합니다.)

반드시 아래 JSON 포맷의 데이터만 반환해줘. 마크다운 기호 없이 순수 JSON만 반환해줘.
[
  {
    "index": <공고의 index>,
    "score": <0부터 100 사이의 정수 점수>,
    "reason": "<점수 부여의 핵심적인 짧은 한국어 이유 한 줄>"
  },
  ...
]

사용자 프로필:
${profile}

공고 목록:
${JSON.stringify(jobListForAi, null, 2)}
`;

  try {
    const result = await model.generateContent([prompt]);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/^```json\s*|```$/gi, "").trim();
    const aiResults = JSON.parse(cleanedText);

    // 인덱스 범위 방어 처리하여 정렬 맵핑 (독립된 객체 생성)
    const sortedResults = Array.from({ length: jobs.length }, () => ({
      score: 0,
      reason: "스크리닝 실패",
    }));

    if (Array.isArray(aiResults)) {
      aiResults.forEach((res) => {
        if (
          res &&
          typeof res === "object" &&
          typeof res.index === "number" &&
          res.index >= 0 &&
          res.index < jobs.length
        ) {
          sortedResults[res.index] = {
            score: typeof res.score === "number" ? res.score : 0,
            reason: typeof res.reason === "string" ? res.reason : "스크리닝 실패",
          };
        }
      });
    }
    return sortedResults;
  } catch (error: any) {
    console.error("[batchScreenJobs] 일괄 AI 스크리닝 중 실패:", error.message);
    return jobs.map(() => ({ score: 0, reason: "AI 스크리닝 통신 오류" }));
  }
};

/**
 * 이미지 URL을 받아 Base64 포맷의 데이터로 변환합니다.
 */
const fetchImageAsBase64 = async (
  url: string
): Promise<{ data: string; mimeType: string } | null> => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 8000,
    });
    const contentType = String(
      response.headers["content-type"] || "image/jpeg"
    );
    const base64Data = Buffer.from(response.data).toString("base64");
    return {
      data: base64Data,
      mimeType: contentType,
    };
  } catch (error: any) {
    console.error(
      `[fetchImageAsBase64] 이미지 다운로드 실패 (${url}):`,
      error.message
    );
    return null;
  }
};

/**
 * Gemini를 사용하여 채용 공고와 사용자 이력 프로필 간의 매칭 적합도를 분석합니다. (멀티모달 이미지 지원)
 */
const analyzeJob = async (
  title: string,
  companyName: string,
  detailText: string,
  base64Image: { data: string; mimeType: string } | null
) => {
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json" },
  });

  const slicedText = detailText.substring(0, 5000);

  const profile = `
공고 분석을 위한 사용자 프로필:
- 직무: Frontend Engineer (프론트엔드 개발자)
- 기술 스택: React, Next.js, TypeScript, JavaScript, HTML, CSS
- 언어/강점: 비즈니스 일본어 가능, 일본 자회사 근무 경험, 일본어 번역/데이터 구축 경험 보유
- 디자인 강점: 산업디자인 경험, UI/UX 관심, 사용자 중심 설계 가능
- 협업 강점: 디자이너 및 백엔드 개발자 협업 경험, 요구사항 정의 및 문서화 경험, 프로젝트 프로세스 관리 경험 보유
- 업무 성향: 새로운 기술 빠른 학습, 문제를 시스템으로 해결하려는 성향, 다양한 이해관계자와의 협업 역량
- 관심사: 일본 관련 업무, SaaS, Web Service, AdTech, Sports, Baseball (스포츠 및 야구)
`;

  const prompt = `
사용자 프로필과 수집한 채용 공고 본문(또는 첨부된 요강 이미지)을 정밀 비교 분석하여 적합도 점수(ai_score)와 추천 상세 사유를 JSON 구조로 뽑아줘.

[채점 가이드라인]
1. 핵심 직무 적합도 (최대 100점):
   - 해당 공고가 '프론트엔드 개발자(React, Next.js, TypeScript 등)' 직무이거나 '일본어 번역/일반 사무/관리/기획/영업지원' 직무 중 하나에 해당한다면 기본적으로 높은 점수(75~90점)를 부여합니다.
   - 단, 단순 영업(Sales), 단순 매장 서비스(호텔 프론트 데스크 등), 현장 노무직, 단순 생산직은 절대 추천하면 안 되며 0~30점의 매우 낮은 점수를 줍니다.
2. 가점 및 가중치 요소:
   - 프론트엔드 개발 포지션인데 일본계 기업이거나 일본어 활용이 우대되는 하이브리드 공고인 경우: 추가 가점 (+10~15점)으로 90~100점의 최고점을 부여합니다.
   - 협업 역량 및 프로젝트 관리 경험이 잘 서술된 경우: 추가 가점 (+5~10점)
   - UI/UX 설계 및 디자인 역량 우대 시: 추가 가점 (+5~10점)
   - SaaS, AdTech, 스포츠/야구 도메인 관련: 추가 가점 (+5점)

적합도 점수가 70점 이상인 경우에 한해서 recommend를 true로 해주고, 그렇지 않으면 false로 해줘.
만약 동봉된 상세 이미지가 있다면, 이미지 내의 모든 글씨(자격 요건, 우대사항 등)를 판독(OCR)하여 동일하게 평가 기준에 따라 분석해줘.

${profile}

채용 공고 정보:
- 회사명: ${companyName}
- 공고 제목: ${title}
- 공고 본문 텍스트 요약: ${slicedText}

반드시 아래 JSON 형태의 데이터만 정규 구조로 반환해줘. 마크다운 기호 없이 순수 JSON만 반환해줘.
{
  "score": <0부터 100 사이의 적합도 점수 정수>,
  "recommend": <추천 여부 true 또는 false>,
  "reason": "<왜 이 공고를 추천하는지 사용자 프로필의 강점 및 기술 스택과 비교한 간결한 한두 줄의 한국어 요약 설명>",
  "matched_keywords": [<매칭된 핵심 키워드 목록, 예: "React", "Next.js", "일본어" 등 최대 3개>],
  "matched_strengths": [<프로필의 4대 강점 중 매칭되는 강점 키워드 목록: "Frontend", "Japanese", "Design", "Communication" 중에서 적합한 것들을 골라 배열로 입력>]
}
`;

  const contentParts: any[] = [prompt];
  if (base64Image) {
    contentParts.push({
      inlineData: {
        data: base64Image.data,
        mimeType: base64Image.mimeType,
      },
    });
  }

  const result = await model.generateContent(contentParts);
  const text = result.response.text();
  const cleanedText = text.replace(/^```json\s*|```$/gi, "").trim();
  return JSON.parse(cleanedText);
};

/**
 * 일시적 503/429 오류를 처리하기 위해 지수 백오프 기반 재시도를 적용하는 헬퍼 함수입니다.
 */
const analyzeJobWithRetry = async (
  title: string,
  companyName: string,
  detailText: string,
  base64Image: { data: string; mimeType: string } | null,
  retries = 3,
  delay = 2000
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await analyzeJob(title, companyName, detailText, base64Image);
    } catch (error: any) {
      const errorMessage = error.message || "";

      // 일일 총 호출 한도(RPD) 도달 여부 사전 확인 (더이상의 재시도가 의미 없음)
      // 무료 티어 RPM(분당 한도 10회 등) 초과 시에도 "free_tier_requests" 문구가 포함되므로,
      // RPM을 의미하는 "limit: 10", "limit: 15", "limit: 5" 등이 들어있으면 일일 한도가 아닌 분당 한도로 간주하여 재시도하게 처리합니다.
      const hasRpmLimitIndicator =
        errorMessage.includes("limit: 10") ||
        errorMessage.includes("limit: 15") ||
        errorMessage.includes("limit: 5") ||
        errorMessage.includes("GenerateRequestsPerMinute");

      const isDailyLimit =
        !hasRpmLimitIndicator &&
        (errorMessage.includes("GenerateRequestsPerDay") ||
          (errorMessage.includes("free_tier_requests") &&
            (errorMessage.includes("limit: 1500") ||
              errorMessage.includes("limit: 2000"))) ||
          (errorMessage.includes("limit:") &&
            (errorMessage.includes("2000") || errorMessage.includes("1500"))));

      if (isDailyLimit) {
        throw new Error(`DAILY_LIMIT_EXCEEDED: ${errorMessage}`);
      }

      if (i === retries - 1) throw error;

      const isRateLimit =
        errorMessage.includes("429") ||
        errorMessage.includes("Quota exceeded") ||
        errorMessage.includes("quota") ||
        hasRpmLimitIndicator;

      const isTemporary =
        isRateLimit ||
        errorMessage.includes("503") ||
        errorMessage.includes("Service Unavailable");

      if (isTemporary) {
        let waitTime = delay;
        if (isRateLimit) {
          // 에러 메시지에서 "Please retry in X.XXs" 패턴 파싱
          const retryMatch = errorMessage.match(
            /Please retry in (\d+(\.\d+)?)s/i
          );
          if (retryMatch && retryMatch[1]) {
            const parsedSeconds = parseFloat(retryMatch[1]);
            waitTime = Math.ceil(parsedSeconds + 2) * 1000; // 안전 마진 2초 추가
          } else {
            waitTime = 60000; // 파싱 실패 시 안전하게 60초 대기
          }
          console.warn(
            `[AI Analysis] 429 Quota Limit (RPM) 도달. 쿼터 리셋을 위해 ${waitTime / 1000}초간 대기 후 재시도합니다... (시도 ${i + 1}/${retries})`
          );
        } else {
          console.warn(
            `[AI Analysis] 임시 오류 감지 (${errorMessage}). 재시도 대기중... (시도 ${i + 1}/${retries}, 대기: ${waitTime}ms)`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, waitTime));
        delay *= 2; // 지수 백오프
      } else {
        throw error;
      }
    }
  }
};

/**
 * 등록일/수정일 텍스트를 날짜 포맷(YYYY-MM-DD)으로 변환합니다.
 */
const parsePostedAtDate = (postedAtText: string): string => {
  if (!postedAtText) return new Date().toLocaleDateString("sv-SE");
  const cleanText = postedAtText
    .replace(/^(등록일|수정일|등록|수정)\s*/, "")
    .trim();

  if (
    cleanText.includes("방금") ||
    cleanText.includes("시간 전") ||
    cleanText.includes("분 전") ||
    cleanText.includes("오늘")
  ) {
    return new Date().toLocaleDateString("sv-SE");
  }

  if (cleanText.includes("어제") || cleanText.includes("1일 전")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("sv-SE");
  }

  if (cleanText.includes("2일 전")) {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toLocaleDateString("sv-SE");
  }

  const dateRegex = /(\d{2})\/(\d{2})\/(\d{2})/;
  const match = cleanText.match(dateRegex);
  if (match) {
    return `20${match[1]}-${match[2]}-${match[3]}`;
  }

  return new Date().toLocaleDateString("sv-SE");
};

/**
 * GET: 저장된 추천 채용 공고와 그 AI 분석 결과 목록을 반환합니다.
 */
export const GET = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("v_job_recommendations")
      .select("*")
      .eq("is_company_registered", false)
      .eq("is_already_applied", false)
      .order("recommend", { ascending: false })
      .order("ai_score", { ascending: false })
      .order("posted_at", { ascending: false });

    if (error) {
      throw error;
    }

    const result = (data || []).map((job: any) => {
      const finalScore = job.ai_score ?? job.rule_score ?? 0;
      return {
        id: job.id,
        platform: job.platform,
        companyName: job.company_name,
        title: job.title,
        url: job.url,
        postedAt: job.posted_at,
        createdAt: job.created_at,
        description: job.description ?? "",
        ruleScore: job.rule_score ?? 0,
        aiScore: job.ai_score ?? 0,
        finalScore: finalScore, // 정밀 점수 혹은 1차 점수를 아우르는 통합 최종 점수
        recommend: job.recommend ?? false,
        reason: job.reason ?? "",
        matchedKeywords: job.matched_keywords ?? [],
        matchedStrengths: job.matched_strengths ?? [],
        warnings: job.warnings ?? [],
        isCompanyRegistered: job.is_company_registered ?? false,
        isAlreadyApplied: job.is_already_applied ?? false,
      };
    });

    // 최종 노출 정렬 순서 정의 (PostgreSQL NULL 정렬 우회)
    result.sort((a, b) => {
      // 1. 추천 여부로 1차 정렬 (추천 대상이 상단)
      if (a.recommend !== b.recommend) {
        return a.recommend ? -1 : 1;
      }

      if (a.recommend) {
        // 추천 대상(true) 그룹 내: AI 상세 분석 완료(aiScore > 0)가 미완료(aiScore === 0)보다 우선 노출
        const aHasAi = a.aiScore > 0;
        const bHasAi = b.aiScore > 0;
        if (aHasAi !== bHasAi) {
          return aHasAi ? -1 : 1;
        }
      } else {
        // 비추천 대상(false) 그룹 내: AI 상세 분석으로 완전히 배제된 건(aiScore > 0)을 미완료(aiScore === 0)보다 아래로 배치
        const aHasAi = a.aiScore > 0;
        const bHasAi = b.aiScore > 0;
        if (aHasAi !== bHasAi) {
          return aHasAi ? 1 : -1;
        }
      }

      // 3. 동일 그룹 내에서는 최종 점수 내림차순 정렬
      return b.finalScore - a.finalScore;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("[Recommendations API GET] Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

/**
 * 회사명에서 주식회사, (주), (유) 등의 접사 및 공백을 제거하여 정규화합니다.
 */
const cleanCompanyName = (name: string): string => {
  return name
    .replace(/\(주\)/g, "")
    .replace(/주식회사/g, "")
    .replace(/\(유\)/g, "")
    .replace(/유한회사/g, "")
    .replace(/\(재\)/g, "")
    .replace(/재단법인/g, "")
    .replace(/\(사\)/g, "")
    .replace(/사단법인/g, "")
    .replace(/\s+/g, "")
    .trim();
};

/**
 * POST: 키워드 기반 채용 공고 크롤링 및 AI 분석을 가동하고 그 결과를 적재합니다.
 */
export const POST = async () => {
  try {
    // 배포 환경(production)에서의 안티봇(Cloudflare 등) 차단 및 오작동 방지를 위해 크롤링 API를 전면 차단합니다.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          success: false,
          error: "크롤링 기능은 로컬 개발 환경(localhost)에서만 가능합니다.",
        },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const provider = new SaraminProvider();

    // 0. 크롤링 시작 전 기존 jobs 테이블 리셋
    const { error: resetError } = await supabase
      .from("jobs")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (resetError) {
      console.error("기존 추천공고 리셋 실패:", resetError.message);
    } else {
      console.log("기존 추천공고 데이터 리셋 완료.");
    }

    // MVP 수집 대상 키워드
    const keywords = [
      "React",
      "일본어",
      "일본 웹",
      "일본 it",
      "일본계",
      "DX",
      "AX",
    ];

    // 1. 공고 목록 수집
    const rawJobs = await provider.getJobsByKeywords(keywords);

    // [최적화] 이미 관심 기업(companies)에 등록된 회사명 및 지원 완료한 JD URL을 메모리에 미리 캐싱하여 불필요한 크롤링/AI 분석을 시작조차 하지 않도록 방어합니다.
    const { data: companiesList } = await supabase
      .from("companies")
      .select("name, jd_url");

    const registeredNames = (companiesList || []).map((c) => c.name.trim());
    const appliedUrlsSet = new Set(
      (companiesList || [])
        .map((c) => c.jd_url?.trim())
        .filter(Boolean) as string[]
    );

    // 1-1. 중복 회사 및 지원 완료 URL 제거 (Fuzzy/Normalized 매칭 적용)
    const filteredRawJobs = rawJobs.filter((rawJob) => {
      const crawledName = rawJob.companyName.trim();
      const crawledUrl = rawJob.url.trim();

      // 1. URL 중복 체크
      if (appliedUrlsSet.has(crawledUrl)) {
        return false;
      }

      // 2. 회사명 중복 체크 (주식회사/공백 등 제거 후 포함 여부 판단)
      const isRegistered = registeredNames.some((regName) => {
        const cClean = cleanCompanyName(crawledName);
        const rClean = cleanCompanyName(regName);
        return (
          cClean === rClean ||
          cClean.includes(rClean) ||
          rClean.includes(cClean)
        );
      });

      if (isRegistered) {
        return false;
      }

      return true;
    });

    console.log(
      `\n[AI Recommendations] 1차 일괄 AI 스크리닝 개시... (대상: ${filteredRawJobs.length}개)`
    );

    // 1-2. 일괄 AI 스크리닝 수행 (단 1회 호출!)
    const screeningResults = await batchScreenJobs(filteredRawJobs);

    const jobsWithScores = filteredRawJobs
      .map((rawJob, idx) => {
        const screenRes = screeningResults[idx] || { score: 0, reason: "" };
        return {
          ...rawJob,
          ruleScore: screenRes.score, // 기존 ruleScore 컬럼에 AI 1차 점수를 매핑하여 하위 호환성 유지
          screeningReason: screenRes.reason,
        };
      })
      // 1차 점수가 30점 이상인 공고들만 통과시킴 (부적합 공고는 아예 UI 노출 제외)
      .filter((job) => job.ruleScore >= 30);

    // 1-3. 1차 AI 스크리닝 점수 기준 내림차순 정렬 후 상위 5건만 슬라이싱 (Gemini 비용 최적화 핵심)
    jobsWithScores.sort((a, b) => b.ruleScore - a.ruleScore);
    const targetJobs = jobsWithScores.slice(0, 5);
    const skipJobs = jobsWithScores.slice(5);

    console.log(
      `\n[AI Recommendations] 스크리닝 통과 공고: 총 ${jobsWithScores.length}개 (상위 ${targetJobs.length}개 정밀 상세 분석 진행, 나머지 ${skipJobs.length}개 상세 생략 노출)`
    );

    const analyzedList = [];
    let actualAiCallCount = 0;

    for (let idx = 0; idx < targetJobs.length; idx++) {
      const rawJob = targetJobs[idx];
      const progressPrefix = `[${idx + 1}/${targetJobs.length}] [${rawJob.companyName}]`;

      // 2-1. URL 중복 체크 (스킵하지 않고 기존 데이터 존재 시 ID만 따서 업데이트 처리)
      const { data: existingJob, error: checkError } = await supabase
        .from("jobs")
        .select("id")
        .eq("url", rawJob.url)
        .maybeSingle();

      if (checkError) {
        console.error(
          `${progressPrefix} DB 확인 에러 (${rawJob.url}):`,
          checkError.message
        );
        continue;
      }

      // 2-2. 상세 본문 텍스트 및 이미지 주소 추출
      console.log(
        `${progressPrefix} 상세 페이지 본문 텍스트 및 이미지 크롤링 중...`
      );
      const { text: detailText, imageUrls } = await provider.fetchJobDetail(
        rawJob.url
      );
      if (!detailText && imageUrls.length === 0) {
        console.warn(
          `${progressPrefix} 상세 본문 텍스트 및 이미지 수집 실패로 건너뜁니다.`
        );
        continue;
      }

      // 2-3. 캐싱을 위한 본문 내용 해시 생성
      const contentHash = crypto
        .createHash("sha256")
        .update(detailText || imageUrls.join(","))
        .digest("hex");

      // 2-4. content_hash 기준 DB 캐싱 조회
      const { data: cachedJob } = await supabase
        .from("jobs")
        .select("id")
        .eq("content_hash", contentHash)
        .maybeSingle();

      let jobId: string;
      let analysisResult;

      if (cachedJob) {
        console.log(
          `${progressPrefix} [캐시 재활용] 동일한 공고 내용이 이미 분석되었습니다. AI 호출을 스킵하고 캐싱 데이터를 사용합니다.`
        );
        const { data: cachedAnalysis } = await supabase
          .from("job_analysis")
          .select(
            "ai_score, recommend, reason, matched_keywords, matched_strengths"
          )
          .eq("job_id", cachedJob.id)
          .maybeSingle();

        if (!existingJob) {
          const { data: newJob, error: insertJobError } = await supabase
            .from("jobs")
            .insert({
              platform: rawJob.platform,
              company_name: rawJob.companyName,
              title: rawJob.title,
              url: rawJob.url,
              posted_at: parsePostedAtDate(rawJob.postedAt),
              description: detailText,
              content_hash: contentHash,
              rule_score: rawJob.ruleScore,
            })
            .select("id")
            .single();

          if (insertJobError) {
            console.error(
              `${progressPrefix} 캐시 공고 신규 URL 복사 실패:`,
              insertJobError.message
            );
            continue;
          }
          jobId = newJob.id;
        } else {
          jobId = existingJob.id;
          // 기존 공고의 description 및 rule_score 업데이트
          await supabase
            .from("jobs")
            .update({
              description: detailText,
              content_hash: contentHash,
              rule_score: rawJob.ruleScore,
            })
            .eq("id", jobId);
        }

        analysisResult = cachedAnalysis
          ? {
              score: cachedAnalysis.ai_score ?? 0,
              recommend: cachedAnalysis.recommend ?? false,
              reason: cachedAnalysis.reason ?? "",
              matched_keywords: cachedAnalysis.matched_keywords ?? [],
              matched_strengths: cachedAnalysis.matched_strengths ?? [],
            }
          : null;
      } else {
        if (actualAiCallCount >= 5) {
          console.warn(
            `\n${progressPrefix} [AI 수집 상한 도달] 금일 무료 API 한도 보호를 위해 신규 AI 분석 한도(5개)에 도달했습니다. 추가 수집을 스킵하고 수집을 종료합니다.\n`
          );
          break;
        }

        actualAiCallCount++;

        // 2-4-1. 이미지 기반 공고 판정 및 멀티모달 데이터 변환
        const isImageBased = detailText.length < 300 && imageUrls.length > 0;
        let base64Image = null;

        if (isImageBased) {
          console.log(
            `${progressPrefix} [멀티모달 감지] 텍스트 요강이 부실하여 대표 이미지(${imageUrls[0]}) 분석을 병행합니다.`
          );
          base64Image = await fetchImageAsBase64(imageUrls[0]);
        }

        console.log(
          `${progressPrefix} [Gemini AI 분석 중...] 🤖 프로필 매칭 적합도를 매기는 중입니다...`
        );
        try {
          analysisResult = await analyzeJobWithRetry(
            rawJob.title,
            rawJob.companyName,
            detailText,
            base64Image
          );
          console.log(
            `${progressPrefix} [분석 완료] AI 점수: ${analysisResult.score}점 | 추천유무: ${analysisResult.recommend ? "추천" : "제외"}`
          );
        } catch (aiError: any) {
          console.error(
            `${progressPrefix} [AI Analysis Error] ${rawJob.title} 분석 실패:`,
            aiError.message
          );
          if (aiError.message.includes("DAILY_LIMIT_EXCEEDED")) {
            console.warn(
              `\n[AI Recommendations] Gemini API 일일 무료 호출 한도(20회)에 도달했습니다. 추가 분석을 스킵하고 수집을 조기 종료합니다.\n`
            );
            break;
          }
          continue;
        }

        if (!existingJob) {
          // DB에 신규 공고 저장
          const { data: newJob, error: insertJobError } = await supabase
            .from("jobs")
            .insert({
              platform: rawJob.platform,
              company_name: rawJob.companyName,
              title: rawJob.title,
              url: rawJob.url,
              posted_at: parsePostedAtDate(rawJob.postedAt),
              description: detailText,
              content_hash: contentHash,
              rule_score: rawJob.ruleScore,
            })
            .select("id")
            .single();

          if (insertJobError) {
            console.error(
              `${progressPrefix} 신규 공고 저장 실패:`,
              insertJobError.message
            );
            continue;
          }
          jobId = newJob.id;
        } else {
          jobId = existingJob.id;
          // 기존 공고의 description 및 rule_score 업데이트
          await supabase
            .from("jobs")
            .update({
              description: detailText,
              content_hash: contentHash,
              rule_score: rawJob.ruleScore,
            })
            .eq("id", jobId);
        }
      }

      // 2-5. AI 분석 결과를 job_analysis에 저장 (기존 데이터가 있으면 덮어쓰기 위해 delete 후 insert 수행)
      if (analysisResult) {
        // 기존 분석 결과 먼저 지우기
        await supabase.from("job_analysis").delete().eq("job_id", jobId);

        const { error: insertAnalysisError } = await supabase
          .from("job_analysis")
          .insert({
            job_id: jobId,
            rule_score: rawJob.ruleScore,
            ai_score: analysisResult.score,
            recommend: analysisResult.recommend,
            reason: analysisResult.reason,
            matched_keywords: analysisResult.matched_keywords,
            matched_strengths: analysisResult.matched_strengths || [],
          });

        if (insertAnalysisError) {
          console.error(
            `${progressPrefix} 분석 결과 저장 실패:`,
            insertAnalysisError.message
          );
        } else {
          analyzedList.push({
            id: jobId,
            companyName: rawJob.companyName,
            title: rawJob.title,
            url: rawJob.url,
            postedAt: rawJob.postedAt,
            analysis: analysisResult,
          });
        }
      }

      // 봇 방지 대기 및 무료 쿼터 RPM(분당 요청 한도) 제한 우회 딜레이 (1초)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 3. 상세 분석을 건너뛴 나머지 스크리닝 통과 공고들(skipJobs) DB에 고속 일괄 적재
    if (skipJobs.length > 0) {
      const skipUrls = skipJobs.map((j) => j.url);
      const { data: existingJobs, error: checkError } = await supabase
        .from("jobs")
        .select("id, url")
        .in("url", skipUrls);

      if (checkError) {
        console.error("[Skip Jobs] DB 중복 확인 에러:", checkError.message);
      } else {
        const existingUrls = new Set(existingJobs?.map((j) => j.url) || []);
        const insertedJobsMap = new Map<string, string>();

        const jobsToInsert = skipJobs
          .filter((j) => !existingUrls.has(j.url))
          .map((rawJob) => ({
            platform: rawJob.platform,
            company_name: rawJob.companyName,
            title: rawJob.title,
            url: rawJob.url,
            posted_at: parsePostedAtDate(rawJob.postedAt),
            description: "",
            content_hash: crypto
              .createHash("sha256")
              .update(rawJob.url)
              .digest("hex"),
            rule_score: rawJob.ruleScore,
          }));

        let insertJobsSuccess = true;
        if (jobsToInsert.length > 0) {
          const { data: insertedJobs, error: insertJobError } = await supabase
            .from("jobs")
            .insert(jobsToInsert)
            .select("id, url");

          if (insertJobError) {
            console.error(
              "[Skip Jobs] 공고 일괄 저장 실패:",
              insertJobError.message
            );
            insertJobsSuccess = false;
          } else if (insertedJobs) {
            insertedJobs.forEach((j) => {
              insertedJobsMap.set(j.url, j.id);
            });
          }
        }

        if (insertJobsSuccess) {
          // 신규 등록된 공고에 대해서만 분석 결과를 일괄 저장
          const analysisToInsert = skipJobs
            .filter((j) => insertedJobsMap.has(j.url))
            .map((rawJob) => ({
              job_id: insertedJobsMap.get(rawJob.url)!,
              rule_score: rawJob.ruleScore,
              ai_score: null,
              recommend: rawJob.ruleScore >= 60,
              reason: rawJob.screeningReason,
              matched_keywords: [],
              matched_strengths: [],
            }));

          let insertAnalysisSuccess = true;
          if (analysisToInsert.length > 0) {
            const { error: insertAnalysisError } = await supabase
              .from("job_analysis")
              .insert(analysisToInsert);

            if (insertAnalysisError) {
              console.error(
                "[Skip Jobs] 분석 결과 일괄 저장 실패:",
                insertAnalysisError.message
              );
              insertAnalysisSuccess = false;
            }
          }

          if (insertAnalysisSuccess) {
            skipJobs.forEach((rawJob) => {
              const jobId =
                insertedJobsMap.get(rawJob.url) ||
                existingJobs?.find((j) => j.url === rawJob.url)?.id;
              if (jobId) {
                analyzedList.push({
                  id: jobId,
                  companyName: rawJob.companyName,
                  title: rawJob.title,
                  url: rawJob.url,
                  postedAt: rawJob.postedAt,
                  analysis: {
                    score: null,
                    recommend: rawJob.ruleScore >= 60,
                    reason: rawJob.screeningReason,
                    matched_keywords: [],
                    matched_strengths: [],
                  },
                });
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, count: analyzedList.length });
  } catch (error: any) {
    console.error("[Recommendations API POST] Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
