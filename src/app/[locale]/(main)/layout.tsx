import type { Metadata } from "next";

import { Header } from "widgets/Header";
import { Category } from "features/Category";
import { ProfileAside } from "features/Profile";
import { getProfileInfo, getProfileInfoJp } from "entities/user";
import { getCategories } from "entities/category";

export const metadata: Metadata = {
  title: "Rit World",
  description: "Blar blar",
};

export default async function MainLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const profileData =
    locale === "ko" ? await getProfileInfo() : await getProfileInfoJp();
  const categoryData = await getCategories();

  return (
    <div className="flex flex-col items-center w-full">
      {categoryData && <Header data={categoryData} />}
      <div className="flex justify-between w-full lg:w-[80%] md:w-full sm:w-full mt-[10px] mb-0 md:mb-[40px] gap-x-[10px]">
        <div className="hidden lg:flex flex-col">
          <ProfileAside data={profileData} />
          {categoryData && <Category data={categoryData} />}
        </div>
        <div className="sm:pt-[105px] pt-[40px] sm:px-[50px] pb-[40px] w-full bg-black-10 sm:rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
