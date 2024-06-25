import localFont from 'next/font/local';
import type { Metadata } from "next";

import "./globals.css";
import { Header } from "features/Header";
import { ProfileAside } from "features/Profile";
import { Category } from "features/Category";

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/pretendard/Pretendard-Thin.woff',
      weight: '100',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-ExtraLight.woff',
      weight: '200',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-Light.woff',
      weight: '300',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-Regular.woff',
      weight: '400',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-Medium.woff',
      weight: '500',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-SemiBold.woff',
      weight: '600',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-Bold.woff',
      weight: '700',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-ExtraBold.woff',
      weight: '800',
    },
    {
      path: '../../public/fonts/pretendard/Pretendard-Black.woff',
      weight: '900',
    },
  ],
  variable: '--pretendard',
});

export const metadata: Metadata = {
  title: "Rit World",
  description: "Blar blar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <body className="flex justify-center items-center h-full bg-slate-200">
        <div className="flex flex-col items-center w-full h-full">
          <Header />
          <div className="flex justify-between w-[1280px] mt-[10px] mb-[40px] gap-x-[10px]">
            <div>
              <ProfileAside />
              <Category />
            </div>
            <div className="w-full h-screen px-[50px] py-[40px] bg-white rounded-xl overflow-y-scroll">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
