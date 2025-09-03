import { getCategories } from "entities/category";
import BlogFormScreen from "pages/BlogForm/ui/BlogFormScreen";

const EditBlogPage = async () => {
  const categories = await getCategories();
  return <>{categories && <BlogFormScreen isEdit categories={categories} />}</>;
};

export default EditBlogPage;

export const dynamic = "force-dynamic";
