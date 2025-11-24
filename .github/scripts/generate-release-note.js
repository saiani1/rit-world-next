// .github/scripts/generate-release-note.js

const { VertexAI } = require("@google-cloud/vertexai");
const { createClient } = require("@supabase/supabase-js");

// 1. 환경 변수에서 정보 가져오기
const {
  PR_TITLE,
  PR_BODY,
  PR_MERGED_AT,
  GCP_PROJECT_ID,
  GCP_SA_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} = process.env;

// 2. 클라이언트 초기화
const serviceAccount = JSON.parse(GCP_SA_KEY);
const vertexAI = new VertexAI({
  project: GCP_PROJECT_ID,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
});
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const model = "gemini-1.5-pro-001"; // Vertex AI에서 지원하는 모델

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

async function main() {
  try {
    console.log("🚀 Starting release note automation process...");

    // 3. Supabase에서 최신 버전 가져오기
    const { data: latestRelease } = await supabase
      .from("release_note")
      .select("version")
      .order("update_at", { ascending: false })
      .limit(1)
      .single();

    const newVersion = getNextVersion(latestRelease?.version);
    console.log(`✅ Calculated new version: ${newVersion}`);

    // 4. Gemini를 사용하여 PR 내용 분석 및 한국어 노트 생성
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });

    const koreanPrompt = `
      다음 GitHub Pull Request 내용을 분석해서 릴리스 노트를 JSON 형식으로 생성해줘.
      - "type" 필드: 변경 사항의 종류를 분석해서 "ADDED", "CHANGED", "FIXED" 중에서 해당하는 것을 모두 포함하는 배열로 만들어줘.
      - "description" 필드: PR의 핵심 내용을 요약해서 한국어 문장으로 만들고, 반드시 명사형 어미(예: ~함, ~음, ~개선, ~수정)로 끝나도록 작성해줘.

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
    const koreanResponseText = (await koreanResult.response).text();
    const koreanNote = JSON.parse(koreanResponseText);
    console.log("✅ Generated Korean note:", koreanNote);

    // 5. Gemini를 사용하여 일본어로 번역
    const japanesePrompt = `
      다음 한국어 텍스트를 자연스러운 일본어로 번역해줘.
      그리고 번역된 문장이 명사형(예: 〜の改善, 〜を追加)으로 끝나도록 다듬어줘.

      [원본 텍스트]
      ${koreanNote.description}
    `;
    const japaneseResult =
      await generativeModel.generateContent(japanesePrompt);
    const japaneseDescription = (await japaneseResult.response).text();
    console.log("✅ Generated Japanese translation:", japaneseDescription);

    // 6. Supabase에 데이터 저장
    const mergedTimestamp = PR_MERGED_AT;

    // release_note 테이블에 저장
    const { error: koreanInsertError } = await supabase
      .from("release_note")
      .insert([
        {
          update_at: mergedTimestamp,
          version: newVersion,
          type: koreanNote.type,
          description: koreanNote.description,
        },
      ]);
    if (koreanInsertError) throw koreanInsertError;
    console.log("💾 Successfully saved to release_note table.");

    // release_note_translation 테이블에 저장
    const { error: japaneseInsertError } = await supabase
      .from("release_note_translation")
      .insert([
        {
          update_at: mergedTimestamp,
          version: newVersion,
          type: koreanNote.type, // 타입은 동일하게 사용
          description: japaneseDescription,
        },
      ]);
    if (japaneseInsertError) throw japaneseInsertError;
    console.log("💾 Successfully saved to release_note_translation table.");

    console.log("🎉 Automation process completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred during the automation process:", error);
    process.exit(1); // 오류 발생 시 워크플로우를 실패 처리
  }
}

main();
