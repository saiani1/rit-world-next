import BlogListScreen from "page/BlogList/ui/BlogListScreen";
import { getBlogList, getBlogListJp } from "entities/blog";
import { getCategories } from "entities/category";

const HomePage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const blogData =
    locale === "ko" ? await getBlogList() : await getBlogListJp();
  const categoryData = await getCategories();

  return (
    <>
      {blogData && categoryData && (
        <BlogListScreen data={blogData} categoryData={categoryData} />
      )}
    </>
  );
};

export default HomePage;

export const dynamic = "force-dynamic";
