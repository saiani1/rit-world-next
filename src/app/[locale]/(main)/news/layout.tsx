import { ProfileAside } from "features/Profile";
import { getProfileInfo, getProfileInfoJp } from "entities/user";

export default async function NewsLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const profileData =
    locale === "ko" ? await getProfileInfo() : await getProfileInfoJp();

  return (
    <>
      <aside className="hidden lg:flex flex-col">
        <ProfileAside data={profileData} />
      </aside>
      <main className="sm:pt-[105px] pt-[40px] sm:px-[50px] pb-[40px] w-full bg-black-10 sm:rounded-xl">
        {children}
      </main>
    </>
  );
}
