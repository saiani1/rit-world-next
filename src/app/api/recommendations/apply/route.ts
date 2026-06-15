import { NextResponse } from "next/server";

import { saveCompany } from "entities/interview";
import { createClient } from "shared/api/server";

export const POST = async (request: Request) => {
  try {
    const supabase = createClient();

    // 1. Get current logged-in user to check auth and map user_id
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const { companyName, jdUrl, platform } = await request.json();

    if (!companyName || !jdUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 파라미터(companyName, jdUrl)가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const todayStr = new Date().toLocaleDateString("sv-SE");

    // 2. Insert new company row using saveCompany api helper
    const data = await saveCompany(
      {
        name: companyName,
        type: "한국", // Default for saramin scraped jobs
        country: "KR",
        applied_at: todayStr,
        application_method: "직접지원",
        channel: platform || "사람인",
        jd_url: jdUrl,
        status: "서류전형",
        result: "대기중",
        apply_count: 1,
        history: [
          {
            status: "서류전형",
            result: "대기중",
            date: new Date().toISOString(),
          },
        ],
        next_step_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      supabase
    );

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[Recommendations Apply API POST] Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
