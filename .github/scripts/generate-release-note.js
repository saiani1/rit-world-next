// .github/scripts/generate-release-note.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");
const {
  getLatestReleaseVersion,
  saveReleaseNote,
  saveReleaseNoteTranslation,
} = require("../../src/entities/releaseNote/api/release-note");

// 1. 환경 변수에서 정보 가져오기
const {
  PR_TITLE,
  PR_BODY,
  PR_MERGED_AT,
  GEMINI_API_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

// 2. 클라이언트 초기화
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const model = "gemini-flash-latest";

/**
 * 다음 버전 번호를 계산하는 함수 (e.g., "v1.14" -> "v1.15")
 * @param {string | undefined} latestVersion - 현재 최신 버전
 * @returns {string} - 다음 버전
 */
function getNextVersion(latestVersion) {
  if (!latestVersion) return "v1.0"; // 버전이 하나도 없으면 v1.0으로 시작

  const parts = latestVersion.replace("v", "").split(".");
  const major = parts[0];
  const minor = parseInt(parts[1] || "0", 10);
  return `v${major}.${minor + 1}`;
}

/**
 * 릴리스 노트 생성 및 번역, 저장을 위한 메인 로직
 */
async function main() {
  try {
    console.log("🚀 Starting release note automation process...");

    // 3. Supabase에서 최신 버전 가져오기
    const latestVersion = await getLatestReleaseVersion(supabase);
    const newVersion = getNextVersion(latestVersion);
    console.log(`✅ Calculated new version: ${newVersion}`);

    // 4. Gemini를 사용하여 PR 내용 분석 및 한국어 노트 생성
    const generativeModel = genAI.getGenerativeModel({
      model: model,
    });

    const koreanPrompt = `
      다음 GitHub Pull Request 내용을 분석해서 릴리스 노트를 JSON 형식으로 생성해줘.
      - "type" 필드: 변경 사항의 종류를 분석하여 "ADDED", "CHANGED", "FIXED" 중 해당하는 것을 배열로 생성해. 단, 특수한 경우가 아니라면 가급적 가장 핵심적인 1개만 선택하고, 아무리 많아도 최대 2개까지만 포함해야 해. 절대 3개를 모두 포함하지 마.
      - "description" 필드: PR의 핵심 내용을 요약하여 하나의 한국어 문장으로 만들고, 문장의 끝은 반드시 명사형 어미(예: ~함, ~음, ~개선, ~수정)로 마무리.

      [PR 내용]
      제목: ${PR_TITLE}
      본문: ${PR_BODY}

      [출력 형식]
      {
        "type": ["..."],
        "description": "..."
      }
    `;

    const koreanResult = await generativeModel.generateContent(koreanPrompt);
    const koreanResponse = await koreanResult.response;
    const koreanResponseText = koreanResponse.text();
    // AI 응답에 포함될 수 있는 마크다운 코드 블록(```json ... ```)을 제거
    const cleanedJsonString = koreanResponseText
      .replace(/```json|```/g, "")
      .trim();
    const koreanNote = JSON.parse(cleanedJsonString);
    console.log("✅ Generated Korean note:", koreanNote);

    // 5. Gemini를 사용하여 일본어로 번역
    const japanesePrompt = `
      You are a professional translator for software release notes.
      Translate the following Korean text into natural-sounding Japanese.
      The final translated sentence MUST end in a noun form (体言止め), like "〜を修正" or "〜の改善". Do not add any other explanations.
      Korean Text: "${koreanNote.description}"
    `;
    const japaneseResult =
      await generativeModel.generateContent(japanesePrompt);
    const japaneseResponse = await japaneseResult.response;
    const japaneseDescription = japaneseResponse.text();
    console.log("✅ Generated Japanese translation:", japaneseDescription);

    // 6. Supabase에 데이터 저장
    const mergedTimestamp = PR_MERGED_AT;

    // release_note 테이블에 저장
    await saveReleaseNote(supabase, {
      update_at: mergedTimestamp,
      version: newVersion,
      type: koreanNote.type,
      description: koreanNote.description,
    });
    console.log("💾 Successfully saved to release_note table.");

    // release_note_translation 테이블에 저장
    await saveReleaseNoteTranslation(supabase, {
      update_at: mergedTimestamp,
      version: newVersion,
      type: koreanNote.type, // 타입은 동일하게 사용
      description: japaneseDescription,
    });
    console.log("💾 Successfully saved to release_note_translation table.");

    console.log("🎉 Automation process completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred during the automation process:", error);
    process.exit(1); // 오류 발생 시 워크플로우를 실패 처리
  }
}

main();
