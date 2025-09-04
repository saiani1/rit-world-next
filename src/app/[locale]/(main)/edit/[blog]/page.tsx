import { getCategories } from "entities/category";
import BlogFormScreen from "page/BlogForm/ui/BlogFormScreen";

const EditBlogPage = async () => {
  const categories = await getCategories();
  return (
    <>{categories && <BlogFormScreen page="edit" categories={categories} />}</>
  );
};

export default EditBlogPage;

export const dynamic = "force-dynamic";
