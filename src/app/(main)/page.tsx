import BlogListScreen from "pages/BlogList/ui/BlogListScreen";
import { getBlogList } from "entities/blog";

const HomePage = async () => {
  const blogData = await getBlogList();

  return <BlogListScreen data={blogData} />;
};

export default HomePage;
