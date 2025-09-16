import type { Metadata } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "../globals.css";
import { routing } from "i18n/routing";

export const metadata: Metadata = {
  title: "Rit World",
  description: "Blar blar",
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

export default async function RootLayout({
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
    <html lang={locale} className={`${pretendard.variable} h-full`}>
      <body className="h-full bg-slate-200">
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col items-center w-full">
            <main className="w-full">{children}</main>
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
