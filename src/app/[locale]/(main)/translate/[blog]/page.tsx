import BlogFormScreen from "page/BlogForm/ui/BlogFormScreen";
import { getCategories } from "entities/category";

const TranslateBlogPage = async () => {
  const categories = await getCategories();
  return (
    <>
      {categories && (
        <BlogFormScreen page="translate" categories={categories} />
      )}
    </>
  );
};

export default TranslateBlogPage;

export const dynamic = "force-dynamic";
