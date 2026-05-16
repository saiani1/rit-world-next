import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. next-intl 미들웨어 실행하여 초기 응답 생성
  const response = intlMiddleware(request);

  // 2. Supabase 세션 갱신 (응답 객체에 쿠키 반영)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 정보 업데이트
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // 원래의 matcher로 복구하여 로케일 감지 범위를 유지합니다.
  matcher: ["/", "/(jp|ko)/:path*"],
};
