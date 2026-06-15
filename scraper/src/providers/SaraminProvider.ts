import axios from "axios";
import * as cheerio from "cheerio";

import { Job, JobProvider } from "../types";

export class SaraminProvider implements JobProvider {
  platform = "saramin";

  /**
   * 키워드 배열을 순회하며 최근 2일 이내에 등록된 첫 페이지 공고들을 수집하여 중복 제거 후 반환합니다.
   */
  async getJobsByKeywords(keywords: string[]): Promise<Job[]> {
    const allJobs: Job[] = [];
    const seenUrls = new Set<string>();

    for (const keyword of keywords) {
      console.log(
        `[SaraminProvider] '${keyword}' 키워드로 수집을 시작합니다...`
      );
      try {
        const jobs = await this.fetchJobsByKeyword(keyword);
        console.log(
          `[SaraminProvider] '${keyword}' 검색 결과: 총 ${jobs.length}개의 유효 공고 발견 (최근 2일 이내)`
        );

        for (const job of jobs) {
          if (!seenUrls.has(job.url)) {
            seenUrls.add(job.url);
            allJobs.push(job);
          }
        }
      } catch (error: any) {
        console.error(
          `[SaraminProvider] '${keyword}' 수집 중 에러 발생:`,
          error.message
        );
      }

      // 사람인 서버에 부하를 줄이기 위해 500ms~1000ms 정도 대기합니다 (로컬 친화적 크롤링 매너)
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    return allJobs;
  }

  /**
   * 특정 키워드의 검색 결과 첫 페이지에서 최근 2일 이내의 공고를 추출합니다.
   */
  private async fetchJobsByKeyword(keyword: string): Promise<Job[]> {
    const url = `https://www.saramin.co.kr/zf_user/search/recruit?searchword=${encodeURIComponent(keyword)}&sort=pd&company_cd=0,1,2,3,4,5,6,7`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.saramin.co.kr/",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: Job[] = [];

    $(".item_recruit").each((_, el) => {
      const title = $(el).find(".job_tit a").text().trim();
      const relativeUrl = $(el).find(".job_tit a").attr("href") || "";
      const absoluteUrl = relativeUrl.startsWith("/")
        ? `https://www.saramin.co.kr${relativeUrl}`
        : relativeUrl;
      const companyName = $(el).find(".corp_name a").text().trim();

      // '.job_day' 클래스에서 등록일/수정일 추출 (예: "등록일 26/06/14")
      const postedAtText = $(el).find(".job_day").text().trim();

      // 날짜 필터링 (최근 2일 이내인지 검증)
      if (this.isWithinDays(postedAtText, 2)) {
        jobs.push({
          platform: this.platform,
          title,
          companyName,
          url: absoluteUrl,
          postedAt: postedAtText || "날짜 미상",
        });
      }
    });

    return jobs;
  }

  /**
   * 공고의 등록일 텍스트를 파싱하여 특정 일자 이내인지 판단합니다.
   */
  private isWithinDays(postedAtText: string, maxDays: number = 2): boolean {
    if (!postedAtText) return false;

    // '등록일 26/06/14', '수정일 26/06/15', '등록 오늘', '등록 5시간 전' 등 분석
    const cleanText = postedAtText
      .replace(/^(등록일|수정일|등록|수정)\s*/, "")
      .trim();

    // 시간 단위/오늘/어제 등 상대 표시 처리
    if (
      cleanText.includes("방금") ||
      cleanText.includes("시간 전") ||
      cleanText.includes("분 전") ||
      cleanText.includes("오늘") ||
      cleanText.includes("어제") ||
      cleanText.includes("1일 전")
    ) {
      return true;
    }

    if (cleanText.includes("2일 전")) {
      return maxDays >= 2;
    }

    if (cleanText.includes("3일 전")) {
      return maxDays >= 3;
    }

    // YY/MM/DD 포맷 파싱 시도 (예: 26/06/14)
    const dateRegex = /(\d{2})\/(\d{2})\/(\d{2})/;
    const match = cleanText.match(dateRegex);

    if (match) {
      const year = parseInt(`20${match[1]}`, 10);
      const month = parseInt(match[2], 10) - 1; // 0-indexed
      const day = parseInt(match[3], 10);

      const postDate = new Date(year, month, day);
      const today = new Date();

      // 날짜 연산을 위해 시/분/초 초기화
      today.setHours(0, 0, 0, 0);
      postDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - postDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 등록일이 오늘 기준 maxDays 범위 내에 있으면 true
      return diffDays >= 0 && diffDays <= maxDays;
    }

    return false;
  }

  /**
   * 채용공고 상세 페이지 URL에서 공고 본문 텍스트를 크롤링합니다.
   * 사람인 특유의 iframe 구조를 고려하여 실제 렌더링용 내부 URL을 파싱하여 텍스트를 추출합니다.
   */
  async fetchJobDetail(
    url: string
  ): Promise<{ text: string; imageUrls: string[] }> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          Referer: "https://www.saramin.co.kr/",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const iframeSrc = $("#iframe_recruit_entry").attr("src");
      let targetUrl = url;

      if (iframeSrc) {
        targetUrl = iframeSrc.startsWith("/")
          ? `https://www.saramin.co.kr${iframeSrc}`
          : iframeSrc;
      }

      const detailResponse =
        targetUrl !== url
          ? await axios.get(targetUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                Referer: url,
              },
              timeout: 10000,
            })
          : response;

      const $detail = cheerio.load(detailResponse.data);
      let detailText = $detail(".user_content").text().trim();
      if (!detailText) {
        detailText = $detail("body").text().trim();
      }

      // 상세 요강 내부의 모든 이미지 요소를 수집합니다.
      const imageUrls: string[] = [];
      const imgSelector =
        $detail(".user_content img").length > 0 ? ".user_content img" : "img";
      $detail(imgSelector).each((_, imgEl) => {
        let src =
          $detail(imgEl).attr("src") || $detail(imgEl).attr("data-src") || "";
        src = src.trim();
        if (src) {
          let absoluteSrc = src;
          try {
            if (src.startsWith("//")) {
              absoluteSrc = `https:${src}`;
            } else {
              absoluteSrc = new URL(
                src,
                "https://www.saramin.co.kr"
              ).toString();
            }
          } catch (e) {
            // URL 파싱 실패 시 원본 유지
          }

          // 트래킹 비콘이나 base64 data url, 빈 주소는 스킵
          if (
            !absoluteSrc.includes("about:blank") &&
            !absoluteSrc.startsWith("data:") &&
            !imageUrls.includes(absoluteSrc)
          ) {
            imageUrls.push(absoluteSrc);
          }
        }
      });

      return {
        text: detailText.replace(/\s+/g, " "),
        imageUrls,
      };
    } catch (error: any) {
      console.error(
        `[SaraminProvider] 상세 페이지(${url}) 수집 중 오류:`,
        error.message
      );
      return { text: "", imageUrls: [] };
    }
  }
}
