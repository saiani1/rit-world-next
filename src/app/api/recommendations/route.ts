import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "shared/api/server";
import crypto from "crypto";
import axios from "axios";

import { SaraminProvider } from "scraper/src/providers/SaraminProvider";

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * 공고 제목을 바탕으로 1차 Rule 기반 점수를 매깁니다.
 */
const calculateRuleScore = (title: string): number => {
  let score = 0;
  const lowerTitle = title.toLowerCase();

  // 기술 스택 가중치
  if (lowerTitle.includes("react")) score += 3;
  if (lowerTitle.includes("next.js") || lowerTitle.includes("nextjs"))
    score += 3;
  if (lowerTitle.includes("typescript") || lowerTitle.includes("ts"))
    score += 2;
  if (lowerTitle.includes("javascript") || lowerTitle.includes("js"))
    score += 2;

  // 일본어 관련 가중치 (중복 가산을 막기 위해 5점 일괄 부여)
  if (
    lowerTitle.includes("일본어") ||
    lowerTitle.includes("일본계") ||
    lowerTitle.includes("jlpt") ||
    lowerTitle.includes("jpt") ||
    lowerTitle.includes("일본")
  ) {
    score += 5;
  }

  // 디자인 및 협업 관련
  if (
    lowerTitle.includes("ui/ux") ||
    lowerTitle.includes("ui") ||
    lowerTitle.includes("ux")
  )
    score += 1;
  if (lowerTitle.includes("디자인") || lowerTitle.includes("디자이너"))
    score += 1;

  // 운영 관련
  if (
    lowerTitle.includes("광고 운영") ||
    lowerTitle.includes("서비스 운영") ||
    lowerTitle.includes("콘텐츠 운영") ||
    lowerTitle.includes("플랫폼 운영") ||
    lowerTitle.includes("운영")
  ) {
    score += 1;
  }

  // 스포츠 및 야구
  if (lowerTitle.includes("스포츠")) score += 3;
  if (lowerTitle.includes("야구")) score += 5;

  return score;
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
  const modelName = process.env.GEMINI_MODEL || "gemini-flash-latest";
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

평가 가중치 기준:
- 기술 적합도: 40% (React, Next.js, TypeScript 등 기술 스택 매칭)
- 일본어 활용 가능성: 30% (일본계 기업, 일본 연관 업무 매칭)
- 협업 및 커뮤니케이션: 15% (협업 역량 및 프로젝트 관리 능력)
- 디자인 활용 가능성: 10% (UI/UX, 디자인 협업 및 설계 능력)
- 관심 분야 적합도: 5% (SaaS, AdTech, 스포츠/야구 관련 도메인 매칭)

적합도 점수가 70점 이상인 경우에 한해서 recommend를 true로 해주고, 그렇지 않으면 false로 해줘.
만약 동봉된 상세 이미지가 있다면, 이미지 내의 모든 글씨(자격 요건, 우대사항 등)를 판독(OCR)하여 동일하게 평가 기준에 따라 분석해줘.

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
      const isDailyLimit =
        errorMessage.includes("GenerateRequestsPerDay") ||
        errorMessage.includes("free_tier_requests") ||
        (errorMessage.includes("limit:") &&
          (errorMessage.includes("20") || errorMessage.includes("50")));

      if (isDailyLimit) {
        throw new Error(`DAILY_LIMIT_EXCEEDED: ${errorMessage}`);
      }

      if (i === retries - 1) throw error;

      const isRateLimit =
        errorMessage.includes("429") || errorMessage.includes("Quota exceeded");
      const isTemporary =
        isRateLimit ||
        errorMessage.includes("503") ||
        errorMessage.includes("Service Unavailable");

      if (isTemporary) {
        let waitTime = delay;
        if (isRateLimit) {
          waitTime = 20000;
          console.warn(
            `[AI Analysis] 429 Quota Limit 도달. 쿼터 리셋을 위해 20초간 대기 후 재시도합니다... (시도 ${i + 1}/${retries})`
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
  if (!postedAtText) return new Date().toISOString().split("T")[0];
  const cleanText = postedAtText
    .replace(/^(등록일|수정일|등록|수정)\s*/, "")
    .trim();

  if (
    cleanText.includes("방금") ||
    cleanText.includes("시간 전") ||
    cleanText.includes("분 전") ||
    cleanText.includes("오늘")
  ) {
    return new Date().toISOString().split("T")[0];
  }

  if (cleanText.includes("어제") || cleanText.includes("1일 전")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }

  if (cleanText.includes("2일 전")) {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split("T")[0];
  }

  const dateRegex = /(\d{2})\/(\d{2})\/(\d{2})/;
  const match = cleanText.match(dateRegex);
  if (match) {
    return `20${match[1]}-${match[2]}-${match[3]}`;
  }

  return new Date().toISOString().split("T")[0];
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
        recommend: job.recommend ?? false,
        reason: job.reason ?? "",
        matchedKeywords: job.matched_keywords ?? [],
        matchedStrengths: job.matched_strengths ?? [],
        warnings: job.warnings ?? [],
        isCompanyRegistered: job.is_company_registered ?? false,
        isAlreadyApplied: job.is_already_applied ?? false,
      };
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

    const registeredNamesSet = new Set(
      (companiesList || []).map((c) => c.name.trim())
    );
    const appliedUrlsSet = new Set(
      (companiesList || [])
        .map((c) => c.jd_url?.trim())
        .filter(Boolean) as string[]
    );

    // 1-1. 중복 회사 제거 및 1차 Rule Score 계산
    const jobsWithScores = rawJobs
      .filter((rawJob) => {
        if (
          registeredNamesSet.has(rawJob.companyName.trim()) ||
          appliedUrlsSet.has(rawJob.url.trim())
        ) {
          return false;
        }
        return true;
      })
      .map((rawJob) => {
        const ruleScore = calculateRuleScore(rawJob.title);
        return {
          ...rawJob,
          ruleScore,
        };
      });

    // 1-2. Rule Score 기준 내림차순 정렬 후 상위 18건만 슬라이싱 (Gemini 비용 최적화 핵심)
    jobsWithScores.sort((a, b) => b.ruleScore - a.ruleScore);
    const targetJobs = jobsWithScores.slice(0, 18);

    console.log(
      `\n[AI Recommendations] 1차 필터링 완료. 수집 대상 ${rawJobs.length}개 중 Rule Score 상위 ${targetJobs.length}개 공고에 대해 상세 수집 및 AI 매칭 분석을 개시합니다...`
    );

    const analyzedList = [];
    let actualAiCallCount = 0;

    for (let idx = 0; idx < targetJobs.length; idx++) {
      const rawJob = targetJobs[idx];
      const progressPrefix = `[${idx + 1}/${targetJobs.length}] [${rawJob.companyName}]`;

      // 2-1. URL 중복 체크
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

      if (existingJob) {
        console.log(
          `${progressPrefix} 이미 수집 및 분석 완료된 URL이므로 스킵합니다.`
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
        if (actualAiCallCount >= 18) {
          console.warn(
            `\n${progressPrefix} [AI 수집 상한 도달] 금일 무료 API 한도 보호를 위해 신규 AI 분석 한도(18개)에 도달했습니다. 추가 수집을 스킵하고 수집을 종료합니다.\n`
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
      }

      // 2-5. AI 분석 결과를 job_analysis에 저장
      if (analysisResult) {
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

      // 봇 방지 대기
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
