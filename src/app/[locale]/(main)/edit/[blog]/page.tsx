import BlogFormScreen from "page/BlogForm/ui/BlogFormScreen";
import { getCategories } from "entities/category";

const EditBlogPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const categories = await getCategories();

  return (
    <>
      {categories && (
        <BlogFormScreen
          page={locale === "ko" ? "edit" : "editTranslate"}
          categories={categories}
        />
      )}
    </>
  );
};

export default EditBlogPage;

export const dynamic = "force-dynamic";
