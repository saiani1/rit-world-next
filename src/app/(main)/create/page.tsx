import CreateBlogScreen from "pages/CreateBlog/ui/CreateBlogScreen";
import { getCategories } from "entities/category";

const CreateBlogPage = async () => {
  const categories = await getCategories();
  return <CreateBlogScreen categories={categories} />;
};

export default CreateBlogPage;
