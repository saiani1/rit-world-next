import CreateBlogScreen from "pages/CreateBlog/ui/CreateBlogScreen";
import { getCategories } from "entities/category";

const CreateBlogPage = async () => {
  const categories = await getCategories();
  return <>{categories && <CreateBlogScreen categories={categories} />}</>;
};

export default CreateBlogPage;

export const dynamic = "force-dynamic";
