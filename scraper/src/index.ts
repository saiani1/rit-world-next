import { SaraminProvider } from "./providers/SaraminProvider";

const main = async () => {
  console.log("==================================================");
  console.log("  AI 채용공고 추천 시스템 - 크롤러 MVP 프로토타입 실행  ");
  console.log("==================================================");

  // MVP 대상 수집 키워드 정의
  const keywords = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "프론트엔드",
    "퍼블리셔",
    "일본어",
  ];

  console.log(`대상 키워드: ${keywords.join(", ")}`);
  console.log("수집 대상 범위: 최근 2일 이내의 공고\n");

  const provider = new SaraminProvider();

  const startTime = Date.now();
  try {
    const jobs = await provider.getJobsByKeywords(keywords);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n==================================================");
    console.log(`  수집 완료! (소요 시간: ${duration}초)`);
    console.log(`  최근 2일 이내 수집된 고유 공고 수: 총 ${jobs.length}개`);
    console.log("==================================================\n");

    if (jobs.length === 0) {
      console.log(
        "⚠️ 최근 2일 이내의 조건에 부합하는 채용공고를 찾지 못했습니다."
      );
    } else {
      // 콘솔에 보기 좋게 테이블 형태로 정렬하여 출력
      const tableData = jobs.map((job, idx) => ({
        번호: idx + 1,
        회사명: job.companyName.substring(0, 15),
        공고제목:
          job.title.length > 30
            ? `${job.title.substring(0, 30)}...`
            : job.title,
        등록일: job.postedAt,
        상세URL: job.url,
      }));

      console.table(tableData);

      // 개별 공고 리스트도 깔끔하게 텍스트 출력
      console.log("\n--- 상세 리스트 ---");
      jobs.forEach((job, idx) => {
        console.log(`[${idx + 1}] ${job.companyName} | ${job.title}`);
        console.log(`    등록일: ${job.postedAt}`);
        console.log(`    URL: ${job.url}`);
        console.log("-".repeat(60));
      });
    }
  } catch (error: any) {
    console.error(
      "크롤러 실행 도중 예기치 않은 오류가 발생했습니다:",
      error.message
    );
  }
};

main();
