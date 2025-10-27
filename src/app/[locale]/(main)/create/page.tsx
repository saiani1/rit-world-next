import BlogFormScreen from "pages/BlogForm/ui/BlogFormScreen";
import { getCategories } from "entities/category";

const CreateBlogPage = async () => {
  const categories = await getCategories();
  return (
    <>
      {categories && <BlogFormScreen page="create" categories={categories} />}
    </>
  );
};

export default CreateBlogPage;

export const dynamic = "force-dynamic";
