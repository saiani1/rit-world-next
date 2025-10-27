import BlogFormScreen from "pages/BlogForm/ui/BlogFormScreen";
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

  return (
    <>
      {categories && blogData && (
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
