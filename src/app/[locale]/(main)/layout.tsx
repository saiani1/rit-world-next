import type { Metadata } from "next";

import { Header } from "features/Header";
import { Category } from "features/Category";
import { ProfileAside } from "features/Profile";
import { getProfileInfo } from "entities/user";
import { getCategories } from "entities/category";

export const metadata: Metadata = {
  title: "Rit World",
  description: "Blar blar",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileData = await getProfileInfo();
  const categoryData = await getCategories();

  return (
    <div className="flex flex-col items-center w-full max-h-[1000px]">
      <Header />
      <div className="flex justify-between w-[80%] mt-[10px] mb-[40px] gap-x-[10px] overflow-hidden">
        <div className="flex flex-col">
          <ProfileAside data={profileData} />
          {categoryData && <Category data={categoryData} />}
        </div>
        <div className="pt-[105px] px-[50px] pb-[40px] w-full bg-white rounded-xl overflow-scroll">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
