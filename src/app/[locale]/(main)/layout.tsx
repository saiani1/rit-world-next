import { Header } from "widgets/Header";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="flex justify-between w-full lg:w-[80%] md:w-full sm:w-full mt-[10px] mb-0 md:mb-[40px] gap-x-[10px]">
        {children}
      </div>
    </div>
  );
}
