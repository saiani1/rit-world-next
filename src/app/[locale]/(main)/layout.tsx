import { Header } from "widgets/Header";
import { getCategories } from "entities/category";

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryData = await getCategories();

  return (
    <div className="flex flex-col items-center w-full">
      {categoryData && <Header data={categoryData} />}
      <div className="flex justify-between w-full lg:w-[80%] md:w-full sm:w-full mt-[10px] mb-0 md:mb-[40px] gap-x-[10px]">
        {children}
      </div>
    </div>
  );
}
