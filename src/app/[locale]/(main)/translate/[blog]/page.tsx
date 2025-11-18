import { notFound } from "next/navigation";
import BlogFormScreen from "page/BlogForm/ui/BlogFormScreen";
import { getCategories } from "entities/category";
import { getBlogByPath, getBlogByPathJp } from "entities/blog";

const TranslateBlogPage = async ({
  params: { locale, blog },
}: {
  params: { locale: string; blog: string };
}) => {
  const [categories, blogData] = await Promise.all([
    getCategories(),
    locale === "ko" ? getBlogByPath(blog) : getBlogByPathJp(blog),
  ]);

  // 데이터가 없으면 notFound()를 호출하여 404 페이지를 띄웁니다.
  if (!blogData) {
    notFound();
  }

  return (
    <>
      {categories && (
        <BlogFormScreen
          page="translate"
          categories={categories}
          data={blogData}
        />
      )}
    </>
  );
};

export default TranslateBlogPage;

export const dynamic = "force-dynamic";
