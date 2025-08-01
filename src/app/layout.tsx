import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/pretendard/Pretendard-Thin.woff",
      weight: "100",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-ExtraLight.woff",
      weight: "200",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Light.woff",
      weight: "300",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Regular.woff",
      weight: "400",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Medium.woff",
      weight: "500",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-SemiBold.woff",
      weight: "600",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Bold.woff",
      weight: "700",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-ExtraBold.woff",
      weight: "800",
    },
    {
      path: "../../public/fonts/pretendard/Pretendard-Black.woff",
      weight: "900",
    },
  ],
  variable: "--pretendard",
});

export const metadata: Metadata = {
  title: "Rit World",
  description: "Blar blar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable} h-full`}>
      <body className="h-full bg-slate-200">
        <div className="flex flex-col items-center w-full max-h-[1000px]">
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
      </body>
    </html>
  );
}
