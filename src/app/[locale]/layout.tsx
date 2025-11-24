import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { routing } from "i18n/routing";

export const generateMetadata = async ({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> => {
  const descriptions: Record<string, string> = {
    ko: "프론트엔드 개발자 Rit의 기술블로그, 웹 개발과 프로그래밍 관련 경험과 팁을 공유합니다.",
    jp: "フロントエンド開発者Ritの技術ブログで、ウェブ開発やプログラミングに関する経験を共有します。",
    en: "Rit's personal tech blog for frontend development, sharing experiences and tips on web development and programming.",
  };

  return {
    title: "Rit World",
    description: descriptions[locale] || descriptions["en"],
    other: {
      "naver-site-verification": "2a84108d3bfdd773423ddc310832b698151532e7",
    },
  };
};

const pretendard = localFont({
  src: [
    {
      path: "../../../public/fonts/pretendard/Pretendard-Thin.woff",
      weight: "100",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-ExtraLight.woff",
      weight: "200",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-Light.woff",
      weight: "300",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-Medium.woff",
      weight: "500",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-Bold.woff",
      weight: "700",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-ExtraBold.woff",
      weight: "800",
    },
    {
      path: "../../../public/fonts/pretendard/Pretendard-Black.woff",
      weight: "900",
    },
  ],
  variable: "--pretendard",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--noto-sans-jp",
});

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${pretendard.variable} ${notoSansJp.variable} h-full`}
    >
      <body className="h-full bg-slate-200">
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col items-center w-full">
            <div className="w-full">{children}</div>
            <Toaster
              containerStyle={{
                top: 20,
              }}
              toastOptions={{
                duration: 2000,
              }}
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
