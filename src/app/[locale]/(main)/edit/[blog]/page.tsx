import BlogFormScreen from "page/BlogForm/ui/BlogFormScreen";
import { getCategories } from "entities/category";
import { getBlogByPath, getBlogByPathJp } from "entities/blog";

const EditBlogPage = async ({
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
          page={locale === "ko" ? "edit" : "editTranslate"}
          categories={categories}
          data={blogData}
        />
      )}
    </>
  );
};

export default EditBlogPage;

export const dynamic = "force-dynamic";
