import { Category } from "features/Category";
import { ProfileAside } from "features/Profile";
import { getProfileInfo, getProfileInfoJp } from "entities/user";
import { getCategories } from "entities/category";

export default async function BlogLayout({
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
    <>
      <aside className="hidden lg:flex flex-col">
        <ProfileAside data={profileData} />
        {categoryData && <Category data={categoryData} />}
      </aside>
      <main className="sm:pt-[105px] pt-[40px] sm:px-[50px] pb-[40px] w-full bg-black-10 sm:rounded-xl">
        {children}
      </main>
    </>
  );
}
