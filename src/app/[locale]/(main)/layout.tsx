import { Header } from "widgets/Header";
import { ProfileAside } from "features/Profile";
import { Category } from "features/Category";
import { getCategories } from "entities/category";
import { getProfileInfo, getProfileInfoJp } from "entities/user";

export default async function MainLayout({
  children,
  modal,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { locale: string };
}>) {
  const profileData =
    locale === "ko" ? await getProfileInfo() : await getProfileInfoJp();
  const categoryData = await getCategories();

  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="flex justify-between w-full lg:w-[80%] md:w-full sm:w-full mt-[10px] mb-0 md:mb-[40px] gap-x-[10px]">
        <aside className="hidden lg:flex flex-col">
          <ProfileAside data={profileData} />
          {categoryData && <Category data={categoryData} />}
        </aside>
        <main className="sm:pt-[105px] pt-[40px] sm:px-[50px] pb-[40px] w-full h-auto min-h-screen bg-black-10 sm:rounded-xl">
          {children}
          {modal}
        </main>
      </div>
    </div>
  );
}
